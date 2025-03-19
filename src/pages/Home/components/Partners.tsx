import Marquee from "react-fast-marquee";
import daiCoin from "../../../assets/partners/dai-coin.png";
import metamask from "../../../assets/partners/metamask.webp";
import ploygon from "../../../assets/partners/polygon-scan.webp";
import trust from "../../../assets/partners/trust-wallet.png";
import tokenPocket from "../../../assets/partners/token-pocket.png";
import { Link } from "react-router-dom";

export default function Partners() {
  return (
    <section className="bg-base-200 text-center w-full border-b-2 border-amber-50/50 pb-4 border-t-2 border-y-secondary">
      <div className={"text-3xl font-bold my-4"}>Foreign Partners</div>
      <Marquee className="w-full flex  border-gray-700 z-[4] py-2 h-[100px]">
        <Link to={"https://makerdao.com/"}>
          <img src={daiCoin} className={"mx-5"} width={"85px"} alt="" />
        </Link>
        <Link to={"https://www.tokenpocket.pro/"}>
          <img src={tokenPocket} className={"mx-5"} width={"85px"} alt="" />
        </Link>
        <Link to={"https://polygonscan.com/"}>
          <img src={ploygon} className={"mx-5"} width={"85px"} alt="" />
        </Link>
        <Link to={"https://metamask.io/"}>
          <img src={metamask} className={"mx-5"} width={"85px"} alt="" />
        </Link>
        <Link to={"https://trustwallet.com/"}>
          <img src={trust} className={"mx-5"} width={"85px"} alt="" />
        </Link>
      </Marquee>
    </section>
  );
}
