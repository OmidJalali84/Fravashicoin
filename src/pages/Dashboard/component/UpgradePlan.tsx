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
    amountValue.current.value = prop.upgradeCredit;
  };

  // Step 1: Handle Approval
  const handleApproval = async () => {
    setLoading(true);
    try {
      // Pass the numeric value from the input to the approval function
      const amountToSend = (
        (Number(amountValue.current.value) * 105) /
        100
      ).toString();
      const tx = await approveUser(amountToSend);
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
    try {
      e.preventDefault();
      setLoading(true);
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
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        {/* Approve Step */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              !isApproved
                ? "bg-green-500 shadow-lg"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            1
          </div>
          <span className="mt-2 text-xs">Approve</span>
        </div>

        {/* Connector */}
        <div className="flex-1 h-1 bg-gray-300 mx-1 relative">
          <div
            className={`h-full bg-green-500 ${
              isApproved ? "w-full" : "w-0"
            } transition-all duration-300`}
          ></div>
        </div>

        {/* Upgrade Step */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              isApproved ? "bg-blue-500 shadow-lg" : "bg-gray-300 text-gray-600"
            }`}
          >
            2
          </div>
          <span className="mt-2 text-xs">Upgrade</span>
        </div>
      </div>

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
          <span className="btn input-bordered join-item">
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

      {/* Two-step Buttons */}
      <div className="flex flex-col gap-4 mt-4">
        {!isApproved && (
          <button
            type="button"
            disabled={loading}
            onClick={handleApproval}
            className="btn border-0 bg-green-600 hover:bg-green-500 text-white py-3 rounded-full flex items-center justify-center"
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
            className="btn border-0 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-full flex items-center justify-center"
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
