import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  getUserInfo,
  getUserBalance,
  getUnlockedAmount,
  getLockedAmount,
  zeroAddr,
} from "../../modules/web3/actions";
import ProfileBanner, {
  PropsProfileBanner,
} from "../../components/profile/ProfileBanner";
import { yankClipboard } from "../../modules/clipboard";
// import { useNavigate } from "react-router-dom";
// import Path from "../../routes/path";
// import { useWeb3Modal } from "@web3modal/wagmi/react";
import ProfileCards from "../../components/profile/ProfileCards";
import UpgradePlan from "./component/UpgradePlan";
import ProfileStage from "../../components/profile/ProfileStage";

// const { open } = useWeb3Modal();

export default function Dashboard() {
  const { address } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);
  // const navigate = useNavigate();

  const [totalBalance, setTotalBalance] = useState(0);

  // Fetch main user info
  const { data: userInfo } = getUserInfo(address || zeroAddr);
  const { data: userBalance } = getUserBalance(address || zeroAddr);
  const { data: unlockedBalance } = getUnlockedAmount(address || zeroAddr);
  const { data: lockedBalance } = getLockedAmount(address || zeroAddr);

  useEffect(() => {

    const balance =
      (parseInt(userBalance) +
        parseInt(unlockedBalance) +
        parseInt(lockedBalance)) /
      1e18;
    setTotalBalance(balance);
  }, [userBalance, unlockedBalance, lockedBalance]);

  // Prepare data for the ProfileBanner & ProfileCards
  const profileBannerData: PropsProfileBanner = {
    walletAddr: address,
    userBalance: totalBalance,
    username: userInfo?.username,
    joined: userInfo?.registrationTime.toString(),
  };

  const data = {
    username: userInfo?.username,
    active: userInfo?.active,
    leftUser: userInfo?.leftUsername == "" ? "nobody" : userInfo?.leftUsername,
    middleUser:
      userInfo?.middleUsername == "" ? "nobody" : userInfo?.middleUsername,
    rightUser:
      userInfo?.rightUsername == "" ? "nobody" : userInfo?.rightUsername,
    firstDirectLock: userInfo?.firstDirectLockAmount
      ? parseInt(userInfo?.firstDirectLockAmount) / 1e18
      : 0,
    upgradeCredit: userInfo?.upgradeCredit
      ? parseInt(userInfo?.upgradeCredit) / 1e18
      : 0,
  };

  const specifyPlace = (placeIndex: number) => {
    if (placeIndex == 0) return "Right";
    else if (placeIndex == 1) return "Middle";
    else if (placeIndex == 2) return "Left";
    else return "Owner";
  };

  const stage = {
    username: userInfo?.username,
    upline:
      userInfo?.referrerUsername === "" ? "nobody" : userInfo?.referrerUsername,
    place: specifyPlace(parseInt(userInfo?.position) ?? "0"),
    registerTime: parseInt(userInfo?.registrationTime ?? "0"),
    unlockedLevels: parseInt(userInfo?.unlockedLevels ?? "0"),
    entryAmount: userInfo?.entryAmount
      ? parseInt(userInfo?.entryAmount) / 1e18
      : 0,
    upgradeCredit: userInfo?.upgradeCredit
      ? parseInt(userInfo?.upgradeCredit) / 1e18
      : 0,
    lockedAmount: lockedBalance ? parseInt(lockedBalance) / 1e18 : 0,
    unlockedAmount: unlockedBalance ? parseInt(unlockedBalance) / 1e18 : 0,
    firstDirectLock: userInfo?.firstDirectLockAmount
      ? parseInt(userInfo?.firstDirectLockAmount) / 1e18
      : 0,
    thirdDirectLock: userInfo?.thirdDirectLockAmount
      ? parseInt(userInfo?.thirdDirectLockAmount) / 1e18
      : 0,
    directs: parseInt(userInfo?.directs ?? "0"),
    rightUsername:
      userInfo?.rightUsername == "" ? "___" : userInfo?.rightUsername,
    rightReward: userInfo?.rightReward
      ? parseInt(userInfo?.rightReward) / 1e18
      : 0,
    middleUsername:
      userInfo?.middleUsername == "" ? "___" : userInfo?.middleUsername,
    middleReward: userInfo?.middleReward
      ? parseInt(userInfo?.middleReward) / 1e18
      : 0,
    leftUsername: userInfo?.leftUsername == "" ? "___" : userInfo?.leftUsername,
    leftReward: userInfo?.leftReward
      ? parseInt(userInfo?.leftReward) / 1e18
      : 0,
    totalReward: userInfo?.totalReward
      ? parseInt(userInfo?.totalReward) / 1e18
      : 0,
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
          https://fravashicoin.vercel.app/register?ref={data.username}
        </span>
        <button
          className="w-full btn border-0 bg-blue-600 text-white/80 rounded-lg mt-2"
          onClick={() =>
            yankClipboard(
              "https://fravashicoin.vercel.app/register?ref=" + data.username
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

      <ProfileStage stage={stage} isSearch={false} />

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
          <UpgradePlan upgradeCredit={data.upgradeCredit} />
        </Box>
      </Modal>
    </main>
  );
}
