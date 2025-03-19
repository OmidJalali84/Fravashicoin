import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Path from "../../../routes/path.ts";
import { getUserInfo, zeroAddr } from "../../../modules/web3/actions.ts";

export default function LoginButton() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const navigate = useNavigate();

  const { data: userInfo } = getUserInfo(address ? address : zeroAddr);

  const login = async () => {
    if (!isConnected) open();
    else if (!userInfo?.active) navigate(Path.REGISTER);
    else {
      navigate(Path.DASHBOARD);
    }
  };

  return (
    <button className={"btn btn-success px-10"} onClick={login}>
      Start Now
    </button>
  );
}
