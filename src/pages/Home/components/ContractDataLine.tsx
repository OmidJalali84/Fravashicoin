import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Marquee from "react-fast-marquee";
import { getTotalUsers } from "../../../modules/web3/actions.ts";

export default function ContractDataLine() {
  const {data:totalUsers} = getTotalUsers();

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
          <span className={"text-secondary"}>{Number(totalUsers) || 0 } </span>
        </div>
        <div
          className={
            "flex flex-row md:justify-center items-center gap-1 w-[180px] mx-5"
          }
        >
          <span className={"text-secondary"}>
            <CurrencyExchangeIcon />
          </span>
          <p>Total Entrance</p>
          <span className={"text-secondary"}>{Number(totalUsers) ||"0$"}</span>
        </div>
      </Marquee>
    </section>
  );
}
