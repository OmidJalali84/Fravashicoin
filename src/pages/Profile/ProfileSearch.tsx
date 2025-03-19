import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  getUserInfoWithUsername,
  getUserBalanceByUsername,
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
  const { address } = useAccount();
  const { username } = useParams();

  const navigate = useNavigate();

  const { data: userInfo } = getUserInfoWithUsername(username ? username : "");
  const { data: userBalance } = getUserBalanceByUsername(
    username ? username : ""
  );


  useEffect(() => {
    (async () => {
      console.log(userInfo)
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
    walletAddr: address,
    userBalance: userBalance ? parseInt(userBalance ?? "0") / 1e18 : 0,
    username: userInfo?.username,
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
    firstDirectLock: userInfo?.firstDirectLock
      ? parseInt(userInfo?.firstDirectLock) / 1e18
      : 0,
    upgradeCredit: userInfo?.upgradeCredit
      ? parseInt(userInfo?.upgradeCredit) / 1e18
      : 0,
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
    entryAmount: userInfo?.entryAmount
      ? parseInt(userInfo?.entryAmount) / 1e18
      : 0,
    entryToken: userInfo?.entryToken
      ? parseInt(userInfo?.entryToken) / 1e18
      : 0,
    upgradeCredit: userInfo?.upgradeCredit
      ? parseInt(userInfo?.upgradeCredit) / 1e18
      : 0,
    totalFrozenTokens: userInfo?.totalFrozenTokens
      ? parseInt(userInfo?.totalFrozenTokens) / 1e18
      : 0,
    firstDirectLock: userInfo?.firstDirectLock
      ? parseInt(userInfo?.firstDirectLock) / 1e18
      : 0,
    thirdDirectLock: userInfo?.thirdDirectLock
      ? parseInt(userInfo?.thirdDirectLock) / 1e18
      : 0,
    directs: parseInt(userInfo?.directs ?? "0"),
    rightUsername:
      userInfo?.rightUsername == "" ? "___" : userInfo?.rightUsername,
    middleUsername:
      userInfo?.middleUsername == "" ? "___" : userInfo?.middleUsername,
    leftUsername: userInfo?.leftUsername == "" ? "___" : userInfo?.leftUsername,
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

      <ProfileStage stage={stage} />

      <div className={"my-2"} />
    </main>
  );
}
