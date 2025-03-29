import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import LogoHeader from "../../../public/frv-logo.png";
import { getTokenPrice } from "../../pages/Price/utils/getTokenPrice";

export default function Header() {
  const { isConnected } = useAccount();
  const [state, setState] = useState({ showProfile: false });
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [pricePercentage, setPricePercentage] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const now = Math.floor(Date.now() / 1000);
      const targetTimestamp = now - 24 * 3600;
      const currentPricee = await getTokenPrice(now);
      const basePrice = await getTokenPrice(targetTimestamp);
      const currentPriceValue = Number(currentPricee) / 1e18;
      const basePriceValue = Number(basePrice) / 1e18;
      const percentage =
        ((currentPriceValue - basePriceValue) / basePriceValue) * 100;
      setPricePercentage(percentage);
      setCurrentPrice(currentPriceValue);
    };
    fetchPrice();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("address")) {
      setState({ ...state, showProfile: true });
    }
    if (!isConnected) {
      setState({ ...state, showProfile: false });
      sessionStorage.clear();
    }
  }, [isConnected]);

  return (
    <nav className="navbar sticky top-0 z-[999] border-b-2 border-gray-700 bg-cyan-500/10 backdrop-blur px-4 py-2">
      {/* LEFT: Logo and Price Percentage */}
      <div className="navbar-start flex items-center space-x-4">
        <Link to="/" className="flex items-center">
          <img
            src={LogoHeader}
            alt="Logo"
            className="w-10 h-auto max-w-[40px]"
          />
        </Link>
        <Link to="/price" className="flex flex-wrap items-center">
          <span className="font-bold text-gray-300 text-xs">
            Current FRV Price:
          </span>
          {currentPrice !== null && (
            <span className="ml-1 font-bold text-secondary text-xs">
              {currentPrice.toFixed(6)}$
            </span>
          )}
          {pricePercentage !== null && (
            <span
              className={`ml-1 font-bold text-xs ${
                pricePercentage < 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {pricePercentage < 0 ? "(-" : "(+"}
              {pricePercentage.toFixed(2)}
              {"%)"}
            </span>
          )}
        </Link>
      </div>

      {/* CENTER: Desktop links (hidden on mobile) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/">Whitepaper</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/swap">Swap</Link>
          </li>
          <li>
            <Link to="/price">Price</Link>
          </li>
          {state.showProfile && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
        </ul>
      </div>

      {/* RIGHT: Desktop Connect Wallet + Mobile Hamburger */}
      <div className="navbar-end flex items-center">
        {/* Desktop: Connect Wallet on far right */}
        <div className="hidden lg:block">
          <w3m-button size="sm" balance="hide" />
        </div>

        {/* Mobile: Hamburger Menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 right-0"
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
              <Link to="/swap">Swap</Link>
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
