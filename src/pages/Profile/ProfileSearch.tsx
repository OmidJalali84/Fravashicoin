import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  getUserInfoWithUsername,
  getUserBalance,
  getUnlockedAmount,
  getLockedAmount,
  zeroAddr,
} from "../../modules/web3/actions";
import ProfileBanner, {
  PropsProfileBanner,
} from "../../components/profile/ProfileBanner";
import { yankClipboard } from "../../modules/clipboard";
import { useNavigate } from "react-router-dom";
import Path from "../../routes/path";
import { toast } from "react-toastify";
import ProfileCards from "../../components/profile/ProfileCards";
import ProfileStage from "../../components/profile/ProfileStage";
import { useEffect } from "react";

export default function ProfileSearch() {
  const { username } = useParams();

  const [totalBalance, setTotalBalance] = useState(0);

  const navigate = useNavigate();

  const { data: userInfo } = getUserInfoWithUsername(username ? username : "");
  const { data: userBalance } = getUserBalance(
    userInfo ? userInfo?.userAddress : ""
  );
  const { data: unlockedBalance } = getUnlockedAmount(
    userInfo ? userInfo.userAddress : zeroAddr
  );
  const { data: lockedBalance } = getLockedAmount(
    userInfo ? userInfo.userAddress : zeroAddr
  );

  useEffect(() => {
    const balance =
      (parseInt(userBalance) +
        parseInt(unlockedBalance) +
        parseInt(lockedBalance)) /
      1e18;
    setTotalBalance(balance);
  }, [userBalance, unlockedBalance, lockedBalance]);

  useEffect(() => {
    (async () => {
      if (!userInfo) {
        return;
      }
      if (!userInfo?.active) {
        await toast.info("User not found!");
        navigate(Path.PROFILE);
        return;
      }
    })();
  }, [userInfo, navigate]);

  // Prepare data for the ProfileBanner & ProfileCards
  const profileBannerData: PropsProfileBanner = {
    walletAddr: userInfo?.userAddress,
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
    defiCredit: 0,

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

  return (
    <main
      className={
        "pt-4 mx-auto max-w-screen-xl max-md:px-6 gap-x-4 flex flex-col justify-center content-around"
      }
    >
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

      <ProfileStage stage={stage} isSearch={true} />

      <div className={"my-2"} />
    </main>
  );
}
