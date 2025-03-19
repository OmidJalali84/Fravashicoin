import { useState } from "react";
import {
  approveUser,
  fmtEther,
  getAllowanceValue,
  upgradeUser,
  zeroAddr,
} from "../../modules/web3/actions";
import { toast } from "react-toastify";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../../modules/web3/config";
export interface PropsProfileStage {
  address: string;
  stageValue: number;
  upgradeAmount: number;
  showOnly?: boolean;
  refetch?: CallableFunction
}
import styles from './profile.module.css'

export default function ProfileStage({
  address,
  stageValue,
  upgradeAmount,
  showOnly = false,
  refetch = undefined,
}: PropsProfileStage) {
  const {
    data: allowanceAmount,
    isLoading: waitGetAllowance,
    refetch: refetchAllowance,
  } = getAllowanceValue(address ?? zeroAddr);

  const [waitWeb3, setWaitWeb3] = useState(false);
  function isLoading() {
    return waitWeb3 || waitGetAllowance;
  }

  const upgrade = async () => {
    if (showOnly) {
      toast.error("Can't upgrade in profile page! go to dashboard.");
      return;
    }

    setWaitWeb3(true);

    try {
      if (allowanceAmount && fmtEther(allowanceAmount) >= upgradeAmount) {
        const upgradeTransaction = await upgradeUser();
        toast.success(
          "Upgrade request sent! please wait a few moment for panel to get updated."
        );
        await waitForTransactionReceipt(config, {
          hash: upgradeTransaction,
        })
        if (refetch != undefined)
          await refetch();
      } else {
        toast.info(
          "Not enough allowance value for this upgrade, approve to increase your allowance amount!"
        );
        const approveTransaction = await approveUser(upgradeAmount.toString());
        toast.success(
          "Request sent, wait a few moment and click on the button again to upgrade!"
        );
        await waitForTransactionReceipt(config, {
          hash: approveTransaction,
        })
        await refetchAllowance();
      }
    } catch (err: any) {
      if (err.name === "ContractFunctionExecutionError") {
        switch (true) {
          case /exceeds balance/.test(err.message):
            toast.error("Insufficient funds!");
            break;
          default:
            toast.error(err.message);
            console.log(err);
        }
      }
    }

    setWaitWeb3(false);
  };

  const stageNames = [
    { name: "A1", gold: 11, diamond: 22, total: 33 },
    { name: "B2", gold: 22, diamond: 44, total: 66 },
    { name: "C3", gold: 44, diamond: 88, total: 132 },
    { name: "D4", gold: 88, diamond: 176, total: 264 },
    { name: "E5", gold: 176, diamond: 352, total: 528 },
    { name: "F6", gold: 352, diamond: 704, total: 1056 },
    { name: "G7", gold: 704, diamond: 1408, total: 2112 },
    { name: "H8", gold: 1408, diamond: 2816, total: 4224 },
    { name: "I9", gold: 2816, diamond: 5632, total: 8448 },
    { name: "J10", gold: 5632, diamond: 11264, total: 16896 },
    { name: "K11", gold: 11264, diamond: 22528, total: 33792 },
    { name: "L12", gold: 22528, diamond: 45056, total: 67584 },
  ];

  return (
    <div className={"bg-base-200/30 p-4 my-2 rounded-lg"}>
      <div className="text-xl font-bold pb-2">Profile Stage</div>
      <div className={"grid w-full gap-2 " + styles.profileStage}>
        <div
          className={
            "bg-gray-700/80 p-3 rounded-lg flex justify-between items-center"
          }
        >
          <span className={"font-bold md:text-center w-1/6"}>Name</span>
          <span className={"font-bold text-center w-1/4"}>Gold</span>
          <span className={"font-bold text-center w-1/4"}>Diamond</span>
          <span className={"font-bold text-center w-1/4"}>Upgrade</span>
        </div>
        {stageNames.map((item) => {
          if (item.total === stageValue * 2) {
            return (
              <div
                className={
                  "bg-gray-600/90 p-3 rounded-lg flex justify-between items-center"
                }
                key={item.name}
              >
                <span className={"text-xl font-bold md:text-center w-1/6"}>
                  {item.name}
                </span>
                <span className={" font-bold text-center w-1/4"}>
                  ${item.gold}
                </span>
                <span className={" font-bold text-center w-1/4"}>
                  ${item.diamond}
                </span>
                <button
                  className={
                    "btn btn-sm border-0 text-lg font-bold md:text-center text-zinc-900/90 rounded-full w-1/4 bg-emerald-400/90 hover:bg-emerald-500/90 hover:border-0" +
                    (isLoading() ? " !bg-gray-800" : "")+ 
                    (showOnly ? " !bg-gray-800/20 text-base" : "")
                  }
                  disabled={showOnly ? true : isLoading()}
                  onClick={upgrade}
                >
                  {isLoading() && !showOnly ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "$" + item.total
                  )}
                </button>
              </div>
            );
          } else if (item.total < stageValue * 2) {
            return (
              <div
                className={
                  "bg-gray-600/80 p-3 rounded-lg flex justify-between items-center"
                }
                key={item.name}
              >
                <span className={"text-xl font-bold md:text-center w-1/6"}>
                  {item.name}
                </span>
                <span className={" font-bold text-center w-1/4"}>
                  ${item.gold}
                </span>
                <span className={" font-bold text-center w-1/4"}>
                  ${item.diamond}
                </span>
                <button
                  disabled={true}
                  className={
                    "btn btn-sm font-bold !text-white md:text-center !bg-zinc-900/90 rounded-full w-1/4 text-nowrap overflow-hidden"
                  }
                >
                  ✔️ ${item.total}
                </button>
              </div>
            );
          } else {
            return (
              <div
                className={
                  "bg-gray-600/80 p-3 rounded-lg flex justify-between items-center"
                }
                key={item.name}
              >
                <span className={"text-xl font-bold md:text-center w-1/6"}>
                  {item.name}
                </span>
                <span className={" font-bold text-center w-1/4"}>
                  ${item.gold}
                </span>
                <span className={" font-bold text-center w-1/4"}>
                  ${item.diamond}
                </span>
                <button
                  disabled={true}
                  className={
                    "btn btn-sm font-bold md:text-center rounded-full w-1/4"
                  }
                >
                  ${item.total}
                </button>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
