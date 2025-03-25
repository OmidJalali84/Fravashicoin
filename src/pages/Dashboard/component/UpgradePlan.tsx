// @ts-nocheck
import CachedIcon from "@mui/icons-material/Cached";
import { useRef, useState } from "react";
import DaiLogo from "../../../assets/coins/dai.png";
import MaticLogo from "../../../assets/coins/matic.png";
import { toast } from "react-toastify";
import { upgradePlan, approveUser } from "../../../modules/web3/actions";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../../../modules/web3/config";

export default function UpgradePlan(prop) {
  const amountValue = useRef("");
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const maxSelect = (e) => {
    e.preventDefault();
    amountValue.current.value = parseInt(prop.upgradeCredit);
  };

  // Step 1: Handle Approval
  const handleApproval = async () => {
    setLoading(true);
    try {
      // Pass the numeric value from the input to the approval function
      const tx = await approveUser(amountValue.current.value);
      await waitForTransactionReceipt(config, { hash: tx });
      toast.success("Approval successful!");
      setIsApproved(true);
    } catch (err) {
      toast.error("Approval failed: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  // Step 2: Handle Upgrade
  const callUpgradePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const upgradeTransaction = await upgradePlan(amountValue.current.value);
      await waitForTransactionReceipt(config, { hash: upgradeTransaction });
      toast.success("Upgrade request sent! Check your wallet...");
    } catch (err) {
      if (
        err.name === "TransactionExecutionError" &&
        /rejected/.test(err.message)
      ) {
        toast.error("User rejected transaction");
      } else {
        toast.error(err.message);
        console.log(err);
      }
    }
    setLoading(false);
  };

  return (
    <form className="w-[400px] px-4 pb-4 bg-base-100 rounded-b-lg gap-4 flex flex-col">
      <div className="flex flex-col mt-4">
        <div className="mb-2 flex flex-row items-center justify-between">
          <div className="inline justify-start">
            <span className="font-bold mb-2">Amount in DAI:</span>
          </div>
          <div className="flex justify-end">
            <span className="w-fit self-end">
              Credit: ${prop.upgradeCredit}
              <button
                className="font-bold text-blue-700 ml-2"
                onClick={maxSelect}
              >
                Set Max
              </button>
            </span>
          </div>
        </div>
        <div className="join w-full">
          <span
            onClick={() => setIsDai(!isDai)}
            className="btn input-bordered join-item"
          >
            <img alt="DAI" className="inline w-6" src={DaiLogo} />
          </span>
          <input
            className="input input-bordered join-item w-[90%]"
            ref={amountValue}
            disabled={loading}
            type="number"
            name="amount"
          />
          <span className="btn input-bordered join-item ">$</span>
        </div>
      </div>

      {/* Two-step buttons */}
      <div className="flex flex-col gap-4">
        {!isApproved && (
          <button
            type="button"
            disabled={loading}
            onClick={handleApproval}
            className="btn border-0 bg-green-600 text-white/80 rounded-full"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <span>Approve</span>
            )}
          </button>
        )}

        {isApproved && (
          <button
            type="button"
            disabled={loading}
            onClick={callUpgradePlan}
            className="btn border-0 bg-blue-600 text-white/80 rounded-full"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <span>Upgrade</span>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
