import { useCallback, useEffect, useMemo, useState } from "react";
import { userTree } from "../../modules/web3/actions";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Handle,
  Position,
  BackgroundVariant,
  NodeProps,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Dagre from "@dagrejs/dagre";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
function getLayoutedElements(nodes: any, edges: any, options: any) {
  g.setGraph({ ...options });

  edges.forEach((edge: any) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node: any) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node: any) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
}

function generateTree(
  username: string,
  tree: any[],
  parent: string | undefined = undefined
) {
  let result: any = [];
  let subTree = parent != undefined;
  parent = parent ?? username;

  let level = 1;
  let levelElements: string[] = [];
  let lastLevelElements: string[] = ["user1"];
  let parentWalker = 0;

  let sibling = 0;
  let maxSibling = 2;

  let nonSibling = 0;
  let maxNonSibling = 2 ** level;
  tree.forEach((element, key) => {
    if (element == "") {
      element = null;
    }
    if (parent !== null) {
      result.push({
        id: username + ":" + (element ?? key),
        value: element,
        parent: parent?.includes(":") ? parent : username + ":" + parent,
      });
    }
    levelElements.push(element);
    sibling++;
    nonSibling++;
    if (sibling == maxSibling) {
      sibling = 0;
      parentWalker++;
      if (nonSibling == maxNonSibling) {
        nonSibling = 0;
        parentWalker = 0;
        level++;
        maxNonSibling = 2 ** level;
        lastLevelElements = [...levelElements];
        levelElements = [];
      }

      parent = lastLevelElements[parentWalker];
    }
  });

  let nodes: any = [];
  if (!subTree) {
    nodes.push({
      id: username + ":" + username,
      type: "rootUser",
      data: { label: username },
      position: { x: 0, y: 0 },
    });
  }
  let edges: any = [];
  console.log(result);
  result.forEach((element: any) => {
    nodes.push({
      id: element.id,
      type: element.value === null ? "emptyUser" : "childUser",
      data: { label: element.value },
      position: { x: 0, y: 0 },
    });
    edges.push({
      id: element.id,
      source: element.parent,
      target: element.id,
      animated: true,
    });
  });

  return [nodes, edges];
}

function RootUserNode({ data }: NodeProps) {
  return (
    <>
      <div className="min-w-[100px] px-[15px] h-[25px] bg-blue-900/70 rounded-md text-center text-white border-white outline-1 rounded-4xl backdrop-blur-[0.9px] overflow-hidden">
        {data?.label}
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </>
  );
}

function ChildUserNode({ data }: NodeProps) {
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={false} />

      <div className="px-[15px] h-[25px] bg-blue-900/40 rounded-full text-center text-white border-white border-[0px] rounded-4xl backdrop-blur-[0.9px] overflow-hidden">
        {data?.label}
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </>
  );
}

function EmptyUserNode() {
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <span className="px-[10px] bg-gray-700/40 rounded-full text-center">
        empty
      </span>
    </>
  );
}

function LayoutFlow({ username, tree }: any) {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useEffect(() => {
    const [genNodes, genEdges] = generateTree(username, tree);
    // docs: https://github.com/dagrejs/dagre/wiki#configuring-the-layout
    const layouted = getLayoutedElements(genNodes, genEdges, {
      rankdir: "TB",
      edgesep: 100,
      nodesep: 100,
      ranksep: 100,
    });
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }, []);

  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges, { direction: "TB" });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges]);

  const onUpdateChild = useCallback(
    async (event: any) => {
      let child = event.target.innerHTML;
      if (child == "empty") {
        return;
      }
      const getTree = await userTree(child, 2);

      let skipCall = false;
      edges.map((edge: Edge) => {
        if (edge.source.split(":")[1] == child) {
          skipCall = true;
        }
      });
      if (skipCall) return;

      let parent: string | undefined;
      nodes.map((node: Node) => {
        if (node.data.label == child) {
          parent = node.id;
        }
      });
      if (parent == undefined) return;

      const [genNodes, genEdges] = generateTree(child, [...(getTree || [])], parent);
      const newNodes = nodes;
      newNodes.push(...genNodes);
      setNodes(newNodes);

      const newEdges = edges;
      newEdges.push(...genEdges);
      setEdges(newEdges);

      onLayout();
    },
    [nodes, edges]
  );

  const nodeTypes = useMemo(
    () => ({
      rootUser: RootUserNode,
      childUser: ChildUserNode,
      emptyUser: EmptyUserNode,
    }),
    []
  );
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={(e) => {
        onUpdateChild(e);
      }}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      fitView
    >
      <Panel position="bottom-left">
        <button
          onClick={onLayout}
          className="btn btn-outline backdrop-blur-[2px]"
        >
          Reset Layout
        </button>
      </Panel>
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}

export default function ProfileChart() {
  const { username } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [tree, setTree] = useState(["loading"]);

  useEffect(() => {
    (async () => {
      const getTree = await userTree(username, 14) as any[];
      setTree([...getTree]);
      console.log(getTree);
    })();
  }, []);

  return (
    <section style={{ minHeight: "85vh" }}>
      <button onClick={() => navigate(-1)} className="back-arrow">
        &#8592; Back
      </button>{" "}
      {/* Add back arrow button */}
      {tree[0] == "loading" ? (
        "loading chart..."
      ) : (
        <ReactFlowProvider>
          <LayoutFlow username={username} tree={tree} />
        </ReactFlowProvider>
      )}
    </section>
  );
}
