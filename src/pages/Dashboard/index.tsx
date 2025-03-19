import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getUserInfo, getUserName, zeroAddr } from "../../modules/web3/actions";
import ProfileBanner, {
  PropsProfileBanner,
} from "../../components/profile/ProfileBanner";
import { yankClipboard } from "../../modules/clipboard";
import { useNavigate } from "react-router-dom";
import Path from "../../routes/path";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import ProfileCards from "../../components/profile/ProfileCards";
import Withdraw from "./component/Withdraw";

const { open } = useWeb3Modal();

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // State for storing direct usernames
  const [leftDirect, setLeftDirect] = useState("nobody");
  const [middleDirect, setMiddleDirect] = useState("nobody");
  const [rightDirect, setRightDirect] = useState("nobody");

  // Fetch main user info
  const { data: userInfo } = getUserInfo(address || zeroAddr);

  // // Convert direct wallet addresses -> unique usernames
  // useEffect(() => {
  //   if (!userInfo) return;

  //   // Wrap in an async function for clarity
  //   (async () => {
  //     if (userInfo.left && userInfo.left !== zeroAddr) {
  //       const { data } = getUserName(userInfo.left);
  //       setLeftDirect(data || "nobody");
  //     } else {
  //       setLeftDirect("nobody");
  //     }

  //     if (userInfo.middle && userInfo.middle !== zeroAddr) {
  //       const { data } = getUserName(userInfo.middle);
  //       setMiddleDirect(data || "nobody");
  //     } else {
  //       setMiddleDirect("nobody");
  //     }

  //     if (userInfo.right && userInfo.right !== zeroAddr) {
  //       const { data } = getUserName(userInfo.right);
  //       setRightDirect(data || "nobody");
  //     } else {
  //       setRightDirect("nobody");
  //     }
  //   })();
  // }, [userInfo]);

  // Prepare data for the ProfileBanner & ProfileCards
  const profileBannerData: PropsProfileBanner = {
    walletAddr: address,
    reagentId: 1,
    rootLevel: 2,
    accountId: 3,
    joined: parseInt(userInfo?.registerTime ?? "0"),
  };

  const data = {
    username: userInfo?.username,
    active: userInfo?.active,
    leftUser: leftDirect,
    middleUser: middleDirect,
    righrUser: rightDirect,
    firstDirectLock: parseInt(userInfo?.firstDirectLock ?? "0"),
  };

  // For the Withdraw modal
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "black",
    boxShadow: 24,
    borderRadius: "8px",
  };

  const handleOpen = () => setModalOpen(true);

  // If user is not active, redirect or open wallet connect, etc.
  // useEffect(() => {
  //   if (!data.active) {
  //     if (isConnected) {
  //       navigate(Path.REGISTER);
  //       return;
  //     }
  //     open();
  //     return;
  //   }
  // }, [userInfo]);

  return (
    <main className="pt-4 mx-auto max-w-screen-xl max-md:px-6 gap-x-4 flex flex-col justify-center content-around">
      <ProfileBanner {...profileBannerData} />

      {/* share profile link part */}
      <div className="mt-1 w-full bg-gray-950 bg-opacity-30 p-3 rounded-2xl">
        <span className="text-md text-gray-200">Referral Link</span>
        <br />
        <span className="text-sm">
          https://rifex.io/register?ref={data.username}
        </span>
        <button
          className="w-full btn border-0 bg-blue-600 text-white/80 rounded-lg mt-2"
          onClick={() =>
            yankClipboard("https://rifex.io/register?ref=" + data.username)
          }
        >
          Copy Link
        </button>
      </div>

      <ProfileCards {...data} />

      <div className="bg-gradient-to-r from-sky-900 from-20% to-base-200 my-2 rounded-lg flex justify-between gap-3 p-4 mt-2">
        <span className="flex items-center text-md font-bold text-white/80">
          Upgrade Locks: ${data.firstDirectLock}
        </span>
        <button
          className="btn border-2 border-sky-800/60 text-white/80 rounded-lg"
          onClick={handleOpen}
        >
          Withdraw
        </button>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(true)}
        hideBackdrop={false}
        disableEscapeKeyDown={true}
      >
        <Box sx={style}>
          <div className="bg-base-100 rounded-t-lg text-end">
            <button
              className="font-bold mt-2 pr-4"
              onClick={() => setModalOpen(false)}
            >
              <CloseIcon className="w-full" />
            </button>
          </div>
          <Withdraw
            withdrawValue={50 /* or data.diamondEarn */}
            walletAddress={address}
          />
        </Box>
      </Modal>
    </main>
  );
}
