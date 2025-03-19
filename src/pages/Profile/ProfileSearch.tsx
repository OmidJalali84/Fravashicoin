// import { useParams } from "react-router-dom";
// import { getUserInfoWithUsername, getUserStageData } from "../../modules/web3/actions";
// import ProfileBanner, {
//   PropsProfileBanner,
// } from "../../components/profile/ProfileBanner";
// import { yankClipboard } from "../../modules/clipboard";
// import { useNavigate } from "react-router-dom";
// import Path from "../../routes/path";
// import { toast } from "react-toastify";
// import ProfileCards from "../../components/profile/ProfileCards";
// import ProfileStage from "../../components/profile/ProfileStage";
// import { useEffect } from "react";

// export default function ProfileSearch() {
//   const { username } = useParams();

//   const navigate = useNavigate();

//   const { data: userInfo } = getUserInfoWithUsername(username);

//   useEffect(() => {
//     (async () => {
//       if (userInfo.active === false) {
//         toast.info("User not found!");
//         navigate(Path.PROFILE);
//         return;
//       }
//     })();
//   }, [userInfo, navigate]);

//   const { data: getUserStageDetails } = getUserStageData(
//     username,
//     undefined,
//     0
//   );

//   const profileBannerData: PropsProfileBanner = {
//     walletAddr: userInfo?.[0],
//     reagentId: userInfo?.[2],
//     rootLevel: userInfo.unlockedLevels,
//     accountId: userInfo?.[1],
//     joined: getUserStageDetails?.[0],
//   };

//   const data = {
//     username: username,
//     userStatus: userInfo?.[16],
//     leftUser: userInfo?.[15] || "nobody",
//     rightUser: userInfo?.[13] || "nobody",
//     stageValue: parseInt(userInfo?.[5] ?? "0"),
//     upgradeAmount: parseInt(userInfo?.[7] ?? "0"),
//   };

//   return (
//     <main
//       className={
//         "pt-4 mx-auto max-w-screen-xl max-md:px-6 gap-x-4 flex flex-col justify-center content-around"
//       }
//     >
//       <ProfileBanner {...profileBannerData} />

//       {/* share profile link part */}
//       <div className={"mt-1 w-full bg-gray-950 bg-opacity-30 p-3 rounded-2xl"}>
//         <span className={"text-md text-gray-200"}>Referral Link </span>
//         <br />
//         <span className={"text-sm"}>
//           https://Rifex.io/register?ref={data.username}
//         </span>
//         <button
//           className={
//             "w-full btn border-0 bg-blue-600 text-white/80 rounded-full mt-2"
//           }
//           onClick={() =>
//             yankClipboard("https://Rifex.io/register?ref=" + data.username)
//           }
//         >
//           Copy Link
//         </button>
//       </div>

//       <ProfileCards {...data} />

//       <ProfileStage
//         address={""}
//         stageValue={data.stageValue}
//         upgradeAmount={data.upgradeAmount}
//         showOnly={true}
//       />

//       <div className={"my-2"} />
//     </main>
//   );
// }
