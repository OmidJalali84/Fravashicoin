import { Link } from "react-router-dom";
import Path from "../../routes/path";

export interface PropsProfileCards {
  username?: string;
  userStatus?: string;
  leftUser?: string;
  middleUser?: string;
  rightUser?: string;
}

export default function ProfileCards({
  username,
  leftUser,
  middleUser,
  rightUser,
}: PropsProfileCards) {
  return (
    <section className="mt-4">
      <div className={"grid grid-cols-3 gap-2"}>
        <div
          className={
            "bg-gradient-to-bl from-teal-800/50 from-30% to-base-200/10 rounded-xl bg-base-200 p-6 flex flex-col gap-2"
          }
        >
          <span className={"text-gray-400"}>Left User</span>
          <span className={"text-xl font-bold "}>{leftUser}</span>
        </div>

        <div
          className={
            "bg-gradient-to-bl from-teal-800/50 from-30% to-base-200/10 rounded-xl bg-base-200 p-6 flex flex-col gap-2"
          }
        >
          <span className={"text-gray-400"}>Middle User</span>
          <span className={"text-xl font-bold"}>{middleUser}</span>
        </div>

        <div
          className={
            "bg-gradient-to-br from-teal-800/50 from-30% to-base-200/10 rounded-xl  bg-base-200 p-6 flex flex-col gap-2"
          }
        >
          <span className={"text-gray-400"}>Right User</span>
          <span className={"text-xl font-bold"}>{rightUser}</span>
        </div>
      </div>

      <div
        className={
          "bg-gradient-to-r from-teal-900 from-20% to-base-200 my-2 rounded-lg flex justify-between gap-3 p-4 mt-4"
        }
      >
        <div className={"flex flex-col gap-2"}></div>
        <Link className={"my-auto"} to={`${Path.PROFILE}/${username}/chart`}>
          <button
            className={
              "btn border-2 border-teal-800/60 text-white/80 rounded-lg"
            }
            disabled={true}
          >
            View Chart
          </button>
        </Link>
      </div>
    </section>
  );
}
