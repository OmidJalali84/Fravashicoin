import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import LogoHeader from "../../../public/frv-logo.png";

export default function Header() {
  const { isConnected } = useAccount();
  const [state, setState] = useState({ showProfile: false });

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
    <nav className="navbar sticky top-0 z-[999] border-b-2 border-gray-700 bg-cyan-500/10 backdrop-blur">
      {/* LEFT: Logo */}
      <div className="navbar-start">
        <Link to="/" className="flex items-center ml-2">
          <img src={LogoHeader} alt="Logo" className="w-10 h-auto" />
        </Link>
      </div>

      {/* CENTER: Desktop links (hidden on mobile) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Whitepaper</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/">Swap</Link>
          </li>
          {state.showProfile && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
        </ul>
      </div>

      {/* RIGHT: Desktop Connect Wallet + Mobile Hamburger */}
      <div className="navbar-end">
        {/* Desktop: Connect Wallet on far right */}
        <div className="hidden lg:block mr-2">
          <w3m-button size="sm" balance="hide" />
        </div>

        {/* Mobile: Hamburger Menu (includes Connect Wallet) */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          {/* Mobile menu */}
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Whitepaper</Link>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/">Swap</Link>
            </li>
            {state.showProfile && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
            <li className="mt-2">
              <w3m-button size="sm" balance="hide" />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
