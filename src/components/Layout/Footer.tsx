import { Link } from "react-router-dom";
import { getTotalUsers} from "../../modules/web3/actions";

export default function Footer() {
  const { data: contractInfo } = getTotalUsers();

  return (
    <footer className="bg-base-200 sm:px-4">
      <div className="container mx-auto pt-12 px-4 relative">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div
            className={
              "flex flex-col md:flex-row items-center justify-center p-4 rounded-3xl md:space-x-8 space-y-4 md:space-y-0"
            }
          >
            <div className={"flex flex-col items-center w-60"}>
              <span className={"text-2xl"}>Total Entrance</span>
              <span className={"text-2xl font-bold text-center text-green-600"}>
                {Number(contractInfo) || "0$"}
              </span>
            </div>
            <div className={"flex flex-col items-center w-60"}>
              <span className={"text-2xl"}>Total User</span>
              <span className={"text-2xl font-bold text-center text-secondary"}>
                {Number(contractInfo) || "0 "}
              </span>
            </div>
          </div>
        </div>

        <div className="py-4">
          <hr className="mb-4 opacity-20" />
          <div className="flex flex-wrap -mx-4  items-center">
            <div className="px-4 py-2 w-full md:flex-1">
              <p>&copy; 2022 - 2023. All Rights Reserved - Rifex</p>
            </div>
            <div className="px-4 py-2 w-full sm:w-auto">
              <Link to="#" className="hover:text-primary-600 text-primary-500">
                Privacy Policy
              </Link>{" "}
              |{" "}
              <Link to="#" className="hover:text-primary-600 text-primary-500">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
