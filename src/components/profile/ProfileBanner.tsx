import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import ProfilePicture from "../../assets/profile/default-profile.jpg";
import ProfilePicture from "../../../public/frv-logo.png";
import TimeAgo from "timeago-react";

function copyAddress(address: any) {
  navigator.clipboard.writeText(address);
  toast.success("Address Copied!");
}

export interface PropsProfileBanner {
  walletAddr: any;
  userBalance: any;
  username: any;
  joined: any;
}

export default function ProfileBanner({
  walletAddr,
  userBalance,
  username,
  joined,
}: PropsProfileBanner) {
  if (typeof joined === "string") {
    console.log(joined);
    joined = (parseInt(joined) * 1000).toString();
  }

  return (
    <div className={"w-full bg-gray-950 bg-opacity-30 p-3 rounded-2xl"}>
      <div className={"flex flex-row items-center gap-3 "}>
        <div
          className={
            "relative p-2 rounded-full bg-gradient-to-r from-secondary to-primary"
          }
        >
          <span className="absolute right-4 bottom-2 flex h-3 w-3">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
              style={{
                zIndex: "10",
                backgroundColor: "oklch(0.83 0.14 207.67)",
              }}
            ></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
          <div className={"relative  bg-white rounded-full w-fit"}>
            <img
              src={ProfilePicture}
              className={" rounded-full w-[110px]"}
              alt=""
              style={{ width: "70px" }}
            />
          </div>
        </div>
        <div className={"flex flex-col gap-1 mt-8 "}>
          <span className={"text-white  max-sm:text-sm"}>
            Address:{" "}
            {walletAddr === undefined
              ? "loading"
              : walletAddr?.slice(0, 5) + "..." + walletAddr?.slice(37, 42)}
            <button
              onClick={() => copyAddress(walletAddr)}
              className={"font-bold text-blue-700 md:text-lg rounded-full mb-1"}
            >
              &nbsp;
              <ContentCopyIcon />
            </button>
          </span>

          <span className={"md:text-xl"}>
            Username: <span className={"text-white"}>{username}</span>
          </span>
          <span className={"md:text-xl mb-3"}>
            FRV Balance: {userBalance ?Math.round( userBalance) : "0"} FRV
          </span>
        </div>
      </div>

      <span className={"max-sm:text-sm mt-2"}>
        Joined In: <TimeAgo className={"text-white"} datetime={joined} />
      </span>
    </div>
  );
}
