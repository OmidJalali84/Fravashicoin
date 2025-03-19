import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import routes from "./routes";
import Error from "./pages/Error";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <Error />,
      children: routes,
    },
  ]);

  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default App;
