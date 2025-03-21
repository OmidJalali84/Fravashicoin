import diamond from "../../../assets/plans/diamond.png";
import gold from "../../../assets/plans/gold2.png";
import silver from "../../../assets/plans/silver.webp";
import bronze from "../../../assets/plans/bronze.webp";

export default function Plans() {
  return (
    <section className={"px-8 md:px-20 bg-base-100 py-8 mx-2 rounded-2xl"}>
      <h2 className={"mb-8 text-4xl font-bold shadow"}> Plans</h2>
      <p className="text-xl mb-10">
        Fravashicoin revenue plan has four percentage styles all income plan are
        connected diamond, gold, silver and bronze.
      </p>

      <div className={"grid lg:grid-cols-2 gap-12 container mx-auto"}>
        <div
          className={
            "rounded-3xl py-10 px-8 flex flex-col bg-neutral  p-4 gap-y-4  shadow-gray-800 shadow-md border-secondary border-2"
          }
        >
          <img src={diamond} alt="gem" className={"w-32 h-32"} />
          <h3 className={"text-3xl font-bold"}>DIAMOND PLAN</h3>
          <div className={" border-b border-secondary w-1/2"}></div>
          <span className="text-4xl">+500$ Registration</span>
        </div>
        <div
          className={
            "rounded-3xl py-10 px-8 flex flex-col bg-neutral  p-4 gap-y-4 shadow-gray-800 shadow-md border-secondary border-2"
          }
        >
          <img src={gold} alt="gem" className={"w-32 h-32"} />
          <h3 className={"text-3xl font-bold "}>GOLD PLAN</h3>
          <div className={"border-b border-secondary w-1/2"}></div>
          <span className="text-4xl">150$ - 500$ Registration</span>
        </div>
      </div>

      <div className={"grid lg:grid-cols-2 gap-12 container mx-auto"}>
        <div
          className={
            "rounded-3xl py-10 px-8 flex flex-col bg-neutral  p-4 gap-y-4 shadow-gray-800 shadow-md border-secondary border-2"
          }
        >
          <img src={silver} alt="gem" className={"w-32 h-32"} />
          <h3 className={"text-3xl font-bold "}>SILVER PLAN</h3>
          <div className={"border-b border-secondary w-1/2"}></div>
          <span className="text-4xl">50$ - 150$ Registration</span>
        </div>
        <div
          className={
            "rounded-3xl py-10 px-8 flex flex-col bg-neutral  p-4 gap-y-4  shadow-gray-800 shadow-md border-secondary border-2"
          }
        >
          <img src={bronze} alt="gem" className={"w-32 h-32"} />
          <h3 className={"text-3xl font-bold"}>BRONZE PLAN</h3>
          <div className={"border-b border-secondary w-1/2"}></div>
          <span className="text-4xl">10$ - 50$ Registration</span>
        </div>
      </div>
    </section>
  );
}
