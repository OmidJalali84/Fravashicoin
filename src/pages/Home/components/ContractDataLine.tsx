import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import WaterfallChartIcon from "@mui/icons-material/WaterfallChart";
import Marquee from "react-fast-marquee";
import { getContractInfo } from "../../../modules/web3/actions";

export default function ContractDataLine() {
  type ContractInfoType = string[];
  const { data: contractInfo } = getContractInfo() as {
    data: ContractInfoType;
  };

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
    <section>
      <Marquee className="w-full bg-base-300 border-b-2 border-gray-700 z-[4] py-2 max-sm:overflow-scroll">
        <div
          className={
            " flex flex-row md:justify-center gap-1 items-center w-[120px] mx-5"
          }
        >
          <span className={"text-secondary "}>
            <PeopleAltIcon />
          </span>
          <p className={""}>All Users</p>
          <span className={"text-secondary"}>{data.totalUsers || 0} </span>
        </div>

        <div
          className={
            " flex flex-row md:justify-center gap-1 items-center w-[120px] mx-5"
          }
        >
          <span className={"text-secondary "}>
            <WaterfallChartIcon />
          </span>
          <p className={""}>Price</p>
          <span className={"text-secondary"}>{data.price || 0} </span>
        </div>

        <div
          className={
            "flex flex-row md:justify-center items-center gap-1 w-[180px] mx-5"
          }
        >
          <span className={"text-secondary"}>
            <CurrencyExchangeIcon />
          </span>
          <p>DAI Liquidity</p>
          <span className={"text-secondary"}>{data.daiLiquidity || "0$"}</span>
        </div>

        <div
          className={
            "flex flex-row md:justify-center gap-1 items-center w-[180px] mx-5"
          }
        >
          <span className={"text-secondary "}>
            <CurrencyExchangeIcon />
          </span>
          <p className="whitespace-nowrap">Fravashi Liquidity</p>
          <span className={"text-secondary"}>
            {data?.fravashiLiquidity ?? 0}{" "}
          </span>
        </div>
      </Marquee>
    </section>
  );
}
