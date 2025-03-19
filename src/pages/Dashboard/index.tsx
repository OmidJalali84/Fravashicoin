import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getUserInfo, zeroAddr } from "../../modules/web3/actions";
import ProfileBanner, {
  PropsProfileBanner,
} from "../../components/profile/ProfileBanner";
import { yankClipboard } from "../../modules/clipboard";
// import { useNavigate } from "react-router-dom";
// import Path from "../../routes/path";
// import { useWeb3Modal } from "@web3modal/wagmi/react";
import ProfileCards from "../../components/profile/ProfileCards";
import Withdraw from "./component/Withdraw";
import ProfileStage from "../../components/profile/ProfileStage";

// const { open } = useWeb3Modal();

export default function Dashboard() {
  const { address } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);
  // const navigate = useNavigate();

  // Fetch main user info
  const { data: userInfo } = getUserInfo(address || zeroAddr);

  // Prepare data for the ProfileBanner & ProfileCards
  const profileBannerData: PropsProfileBanner = {
    walletAddr: address,
    reagentId: 1,
    rootLevel: 2,
    accountId: 3,
    joined: userInfo?.registerTime.toString(),
  };

  const data = {
    username: userInfo?.username,
    active: userInfo?.active,
    leftUser: userInfo?.leftUsername == "" ? "nobody" : userInfo?.leftUsername,
    middleUser:
      userInfo?.middleUsername == "" ? "nobody" : userInfo?.middleUsername,
    rightUser:
      userInfo?.rightUsername == "" ? "nobody" : userInfo?.rightUsername,
    firstDirectLock: parseInt(userInfo?.firstDirectLock ?? "0") / 1e18,
    upgradeCredit: parseInt(userInfo?.upgradeCredit ?? "0") / 1e18,
  };

  const specifyPlace = (placeIndex: number) => {
    if (placeIndex == 0) return "Left";
    else if (placeIndex == 1) return "Middle";
    else if (placeIndex == 2) return "Right";
  };

  const stage = {
    username: userInfo?.username,
    upline: userInfo?.upline,
    // upline: userInfo?.uplineUsername,
    place: specifyPlace(parseInt(userInfo?.place) ?? "0"),
    registerTime: parseInt(userInfo?.registerTime ?? "0"),
    unlockedLevels: parseInt(userInfo?.unlockedLevels ?? "0"),
    entryAmount: parseInt(userInfo?.entryAmount ?? "0") / 1e18,
    entryToken: parseInt(userInfo?.entryToken ?? "0") / 1e18,
    upgradeCredit: parseInt(userInfo?.upgradeCredit ?? "0") / 1e18,
    totalFrozenTokens: parseInt(userInfo?.totalFrozenTokens ?? "0") / 1e18,
    firstDirectLock: parseInt(userInfo?.firstDirectLock ?? "0") / 1e18,
    thirdDirectLock: parseInt(userInfo?.thirdDirectLock ?? "0") / 1e18,
    directs: parseInt(userInfo?.directs ?? "0"),
    rightUsername:
      userInfo?.rightUsername == "" ? "___" : userInfo?.rightUsername,
    middleUsername:
      userInfo?.middleUsername == "" ? "___" : userInfo?.middleUsername,
    leftUsername: userInfo?.leftUsername == "" ? "___" : userInfo?.leftUsername,
    active: userInfo?.active ?? false,
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

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
          https:/127.0.0.1:5173/register?ref={data.username}
        </span>
        <button
          className="w-full btn border-0 bg-blue-600 text-white/80 rounded-lg mt-2"
          onClick={() =>
            yankClipboard(
              "https://127.0.0.1:5173/register?ref=" + data.username
            )
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
          Upgrade Plan
        </button>
      </div>

      <ProfileStage stage={stage} />

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
          <Withdraw upgradeCredit={data.upgradeCredit} />
        </Box>
      </Modal>
    </main>
  );
}
