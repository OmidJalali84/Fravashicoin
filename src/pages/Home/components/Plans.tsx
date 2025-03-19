import diamond from "../../../assets/plans/diamond.png";
import gold from "../../../assets/plans/gold.png";

export default function Plans() {
  return (
    <section className={"px-8 md:px-20 bg-base-100 py-8 mx-2 rounded-2xl"}>
      <h2 className={"mb-8 text-4xl font-bold shadow"}> Plans</h2>
      <p className="text-xl mb-10">
        Rifex revenue plan has two percentage styles Both income plan are
        connected gold and diamond.
      </p>

      <div className={"grid lg:grid-cols-2 gap-12 container mx-auto"}>
        <div
          className={
            "rounded-3xl py-10 px-8 flex flex-col bg-neutral  p-4 gap-y-4 shadow-gray-800 shadow-md border-secondary border-2"
          }
        >
          <img src={gold} alt="gem" className={"w-32 h-32"} />
          <h3 className={"text-3xl font-bold "}>GOLD PLAN</h3>
          <div className={"border-b border-secondary w-1/2"}></div>
          <span>
            The income plan includes a percentage without the condition that the
            Person X, whether he is the representative of the persons or the
            representative X, registers a person with the reference code X. The
            registered person who is Y will receive a referral with their link
            up to 5 x rewards without any conditions.
          </span>
        </div>
        <div
          className={
            "rounded-3xl py-10 px-8 flex flex-col bg-neutral  p-4 gap-y-4  shadow-gray-800 shadow-md border-secondary border-2"
          }
        >
          <img src={diamond} alt="gem" className={"w-32 h-32"} />
          <h3 className={"text-2xl font-bold"}>DIAMOND PLAN</h3>
          <div className={"border-b border-secondary w-1/2"}></div>
          <span>
            The diamond monetization plan includes the equilibrium condition.
            You're getting a percentage back apart from the gold plan. The
            X-person on the Left has his own on the right. Introducing X itself
            includes 25% of the percentage and still receives up to 5 levels of
            X Gold percentage.
          </span>
        </div>
      </div>
    </section>
  );
}
