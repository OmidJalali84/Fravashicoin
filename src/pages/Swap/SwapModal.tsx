// @ts-nocheck
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import DaiLogo from "../../assets/coins/dai.png";
import FrvLogo from "../../../public/frv-logo.png";
import { toast } from "react-toastify";
import {
  swapAction,
  approveUser,
  approveUserFrv,
} from "../../modules/web3/actions";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../../modules/web3/config";
import { useAccount } from "wagmi";

export default function SwapModal(prop) {
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const { address } = useAccount();

  const handleApproval = async () => {
    console.log(address);
    setLoading(true);
    const amountToApprove = ((Number(prop.inputAmount) * 105) / 100).toString();
    try {
      const tx = prop.isDaiToFrv
        ? await approveUser(amountToApprove)
        : await approveUserFrv(amountToApprove);
      await waitForTransactionReceipt(config, { hash: tx });
      toast.success("Approval successful!");
      setIsApproved(true);
    } catch (err) {
      toast.error("Approval failed: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  const callSwapAction = async () => {
    setLoading(true);
    try {
      const swapTx = await swapAction(
        address,
        prop.inputAmount,
        !prop.isDaiToFrv
      );
      await waitForTransactionReceipt(config, { hash: swapTx });
      toast.success("Swap request sent! Check your wallet...");
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  };

  console.log(prop.inputAmount);
  console.log(prop.outputAmount);

  return (
    <div className="w-[400px] bg-gray-900 text-white rounded-lg p-8 shadow-xl">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        {/* Approve Step */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              !isApproved
                ? "bg-green-500 shadow-lg"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            1
          </div>
          <span className="mt-2 text-xs">Approve</span>
        </div>

        {/* Connector */}
        <div className="flex-1 h-1 bg-gray-700 mx-2 relative">
          <div
            className={`h-full bg-green-500 ${
              isApproved ? "w-full" : "w-0"
            } transition-all duration-300`}
          ></div>
        </div>

        {/* Swap Step */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              isApproved ? "bg-blue-500 shadow-lg" : "bg-gray-700 text-gray-400"
            }`}
          >
            2
          </div>
          <span className="mt-2 text-xs">Swap</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-6">
        Swap {prop.isDaiToFrv ? "DAI" : "FRV"} to{" "}
        {prop.isDaiToFrv ? "FRV" : "DAI"}
      </h2>

      {/* Input Section */}
      <div className="mb-5">
        <label className="block font-semibold mb-1">
          Input Amount ({prop.isDaiToFrv ? "DAI" : "FRV"}):
        </label>
        <div className="flex items-center bg-gray-800 rounded-lg p-3">
          <input
            className="w-full bg-transparent text-lg outline-none"
            type="number"
            value={prop.inputAmount}
            disabled
          />
          <img
            src={prop.isDaiToFrv ? DaiLogo : FrvLogo}
            alt="Input Token"
            className="w-6 h-6 ml-2"
          />
        </div>
      </div>

      {/* Output Section */}
      <div className="mb-7">
        <label className="block font-semibold mb-1">
          Output Amount ({prop.isDaiToFrv ? "FRV" : "DAI"}):
        </label>
        <div className="flex items-center bg-gray-800 rounded-lg p-3">
          <input
            className="w-full bg-transparent text-lg outline-none"
            type="number"
            value={prop.outputAmount}
            disabled
          />
          <img
            src={prop.isDaiToFrv ? FrvLogo : DaiLogo}
            alt="Output Token"
            className="w-6 h-6 ml-2"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {!isApproved && (
          <button
            onClick={handleApproval}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Approve"
            )}
          </button>
        )}
        {isApproved && (
          <button
            onClick={callSwapAction}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Swap"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
