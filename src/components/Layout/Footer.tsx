import { Link } from "react-router-dom";
import { getContractInfo } from "../../modules/web3/actions";
import { useEffect } from "react";

export default function Footer() {
  type ContractInfoType = string[];
  const { data: contractInfo } = getContractInfo() as {
    data: ContractInfoType;
  };

  useEffect(() => {
    console.log(contractInfo);
  }, [contractInfo]);

  const data = {
    totalUsers: contractInfo ? parseInt(contractInfo[0]) : 0,
    daiLiquidity: contractInfo
      ? (parseInt(contractInfo[1]) / 1e18).toFixed(0)
      : 0,
    fravashiLiquidity: contractInfo
      ? (parseInt(contractInfo[2]) / 1e18).toFixed(0)
      : 0,
    price: contractInfo ? (parseInt(contractInfo[3]) / 1e18).toFixed(6) : 0,
  };

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
              <span className={"text-2xl"}>Total User</span>
              <span className={"text-2xl font-bold text-center text-secondary"}>
                {data.totalUsers || "0"}
              </span>
            </div>

            <div className={"flex flex-col items-center w-60"}>
              <span className={"text-2xl"}>Price</span>
              <span className={"text-2xl font-bold text-center text-green-600"}>
                {data.price || "0"} $
              </span>
            </div>

            <div className={"flex flex-col items-center w-60"}>
              <span className={"text-2xl"}>DAI Liquidity</span>
              <span className={"text-2xl font-bold text-center text-secondary"}>
                {data.daiLiquidity || "0"} $
              </span>
            </div>

            <div className={"flex flex-col items-center w-60"}>
              <span className={"text-2xl"}>Fravashicoin Liquidity</span>
              <span className={"text-2xl font-bold text-center text-green-600"}>
                {data.fravashiLiquidity || "0"} FRV
              </span>
            </div>
          </div>
        </div>

        <div className="py-4">
          <hr className="mb-4 opacity-20" />
          <div className="flex flex-wrap -mx-4  items-center">
            <div className="px-4 py-2 w-full md:flex-1">
              <p>&copy; 2025 - 2026. All Rights Reserved - Fravashicoin</p>
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
