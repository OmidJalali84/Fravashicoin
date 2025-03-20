export default function FAQ() {
  const FAQItems = [
    {
      question: "What is a smart contract?",
      answer:
        "A smart contract is a computer protocol that allows for programmatically automating and managing financial transactions without the need to trust any third party. With a smart contract, a secure and reliable environment for conducting financial operations can be created, which operates automatically and without human intervention.",
    },
    {
      question: "What is Fravashicoin?",
      answer:
        "Fravashicoin is an online business based on web technology 3.0, completely decentralized and accessible to everyone. Our project is a whole universe of cryptocurrency tools where everything is interconnected, and therefore rapid implementation occurs organically.",
    },
    {
      question: "Why is Fravashicoin secure?",
      answer:
        "Fravashicoin is secure. Its operation is fully protected by blockchain technology. Participants do not provide personal data and only use their cryptocurrency wallet address as a login, connected via WEB 3.0. This ensures anonymity. The entire Fravashicoin infrastructure is based on secure smart contracts to prevent external interference, and the website simply displays data from the blockchain.",
    },
    {
      question: "What do I need to start working with Fravashicoin?",
      answer:
        "You will need a phone or laptop, a cryptocurrency wallet (Metamask, Trust Wallet, or Tokenpocket), some Matic for paying Polygon network fees, and DAI.",
    },
    {
      question: "What is the minimum amount of money needed to start earning?",
      answer: "ou can start earning with 10 DAI, equivalent to 10$.",
    },
    {
      question: "How can I earn with Fravashicoin?",
      answer:
        "You can earn by introducing your friends through the referral link",
    },
  ];
  return (
    <section
      className={
        "bg-base-100 w-full py-8 flex-col flex justify-center items-center"
      }
    >
      <div className={"w-full text-center mb-8"}>
        <span className={"text-3xl font-bold text-center"}>FAQs</span>
      </div>
      <div className={"flex flex-col gap-4 w-5/6 md:w-1/2"}>
        {FAQItems.map((item, index) => {
          return (
            <div key={index} className="collapse bg-base-200  ">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                {item.question}
              </div>
              <div className="collapse-content">
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
