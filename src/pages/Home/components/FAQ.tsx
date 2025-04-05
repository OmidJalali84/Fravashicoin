export default function FAQ() {
  const FAQItems = [
    {
      question: "What is a smart contract?",
      answer:
        "A smart contract is a self-executing computer protocol that automates and enforces financial transactions without relying on third-party trust. It creates a secure, tamper-proof environment for financial operations, functioning autonomously and eliminating the need for human intervention.",
    },
    {
      question: "What is Fravashicoin?",
      answer:
        "Fravashicoin is a decentralized Web 3.0 platform designed for universal accessibility. It offers an integrated ecosystem of cryptocurrency tools, where seamless interconnectivity enables organic and rapid adoption.",
    },
    {
      question: "Why is Fravashicoin secure?",
      answer:
        "Fravashicoin prioritizes security through blockchain technology. The platform operates without requiring personal data - participants access the system exclusively via Web 3.0 using their cryptocurrency wallet addresses, ensuring complete anonymity. All operations are secured by immutable smart contracts that prevent external manipulation. The platform's interface simply reflects blockchain data, maintaining full transparency while eliminating vulnerability points.",
    },
    {
      question: "What do I need to start working with Fravashicoin?",
      answer:
        "To get started, you'll need: 1. A smartphone or computer 2. A Web3 wallet (like MetaMask, Trust Wallet, or TokenPocket) 3. Polygon tokens (for Polygon network gas fees) 4. DAI stablecoin for transactions",
    },
    {
      question: "What is the minimum amount of money needed to start earning?",
      answer:
        "The minimum investment to start earning is just 10 DAI (approximately $10). This low entry barrier makes Fravashicoin accessible to everyone.",
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
