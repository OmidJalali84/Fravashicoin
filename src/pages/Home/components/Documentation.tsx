import { Link } from "react-router-dom";
import auditsImg from "../../../assets/audit.png";
import github from "../../../assets/github.png";

export default function Documentation() {
  return (
    <section className={"bg-base-200  py-12"}>
      <div className={"flex flex-col container mx-auto"}>
        <span className={"text-center text-2xl font-bold"}>
          The power of blockchain technology that operates without any
          restrictions has been created around the world.
        </span>
        <span className={"text-center font-bold mt-8"}>
          It can be said that a Global Business Without Borders is a smart
          business that does its financial activity without any geographical
          limitations and benefits its business partners
        </span>
        <span className={"text-center text-3xl font-bold"}>Documentation</span>
        <span className={"text-center mt-4 px-8"}>
          Looking for more details or instructions? No Problem. We've got you
          covered.
        </span>
        <div
          className={
            "mx-10 bg-base-100 p-4 rounded-2xl border-2 border-secondary mt-4"
          }
        >
          <span className={"text-justify "}>
            Fravashi constructor team consists of Two cryptocurrency's experts and
            consultants A cryptocurrency programmer and developer An Anchin
            expert Four financial market advisors Eight marketing and sale
            consultants An huge business consultant.
            <br />
            It's been formed that this global coalition is made up of seventeen
            people from all over the world Who have brilliant experience in
            their field. They've taken a wide position in this area.
          </span>
        </div>
        <div className={"grid lg:grid-cols-2 w-full gap-8 mt-8 px-10"}>
          {/*<div className={"flex flex-row gap-2 bg-neutral rounded-3xl p-8"}>*/}
          {/*    <div>*/}
          {/*    </div>*/}
          {/*    <div className={"flex flex-col justify-center gap-2"}>*/}
          {/*        <span className={"text-lg md:text-3xl font-bold"}>Docs</span>*/}
          {/*        <span>Staking Documentation</span>*/}
          {/*        <span>| <Link to={"#"} className={"link text-secondary text-xl"}>Learn More</Link></span>*/}
          {/*    </div>*/}

          {/*</div>*/}
          {/*<div className={"flex flex-row gap-2 bg-neutral rounded-3xl p-8"}>*/}
          {/*    <div>*/}
          {/*    </div>*/}
          {/*    <div className={"flex flex-col justify-center gap-2"}>*/}
          {/*        <span className={"text-lg md:text-3xl font-bold"}>KYC</span>*/}
          {/*        <span>Staking Documentation</span>*/}
          {/*        <span>| <Link to={"#"} className={"link text-secondary text-xl"}>Learn More</Link></span>*/}
          {/*    </div>*/}
          {/*</div>*/}
          <div
            className={
              "flex flex-row gap-2 bg-neutral rounded-3xl p-8 border-secondary border-2"
            }
          >
            <div>
              <img src={auditsImg} alt="doc" className={"w-28 h-28"} />
            </div>
            <div className={"flex flex-col justify-center gap-2"}>
              <span className={"text-lg md:text-3xl font-bold"}>Audits</span>
              <span>Contract</span>
              <span>
                |{" "}
                <Link to={"#"} className={"link text-accent text-xl"}>
                  Learn More
                </Link>
              </span>
            </div>
          </div>
          <div
            className={
              "flex flex-row gap-2 bg-neutral rounded-3xl p-8 border-secondary border-2"
            }
          >
            <div>
              <img src={github} alt="doc" className={"w-28 h-28"} />
            </div>
            <div className={"flex flex-col justify-center gap-2"}>
              <span className={"text-lg md:text-3xl font-bold"}>Github</span>
              <span>Staking Documentation</span>
              <span>
                |{" "}
                <Link to={"#"} className={"link text-accent text-xl"}>
                  Learn More
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
