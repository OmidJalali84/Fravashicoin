import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import LogoHeader from "../../../public/frv-logo.png";

export default function Header() {
  const { isConnected } = useAccount();
  const [state, setState] = useState({
    showProfile: false,
  });

  useEffect(() => {
    if (sessionStorage.getItem("address")) {
      setState({ ...state, showProfile: true });
    }
    if (!isConnected) {
      setState({ ...state, showProfile: false });
      sessionStorage.clear();
    }
  }, [isConnected, sessionStorage.getItem("address")]);

  return (
    // todo fix 3 pixel scroll snapping off on mobile size
    <nav className="navbar scroll-m-0 bg-cyan-500/10 backdrop-blur sticky top-0 border-b-2 border-gray-700 z-[999]">
      <div className="navbar-start" style={{ position: "relative" }}>
        <Link to={"/"}>
          <img
            src={LogoHeader}
            alt=""
            className="logo"
            style={{ width: "60px", marginLeft: "130px", marginTop: "85px" }}
          />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to={"/"}>Whitepaper</Link>
          </li>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/register"}>Register</Link>
          </li>
          {state.showProfile && (
            <li>
              <Link to={"/profile"}>Profile</Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        <w3m-button size="sm" balance="hide" />
      </div>
    </nav>
  );
}
