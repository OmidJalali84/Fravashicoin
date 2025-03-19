// @ts-nocheck
import CachedIcon from "@mui/icons-material/Cached";
import { useRef, useState } from "react";
import DaiLogo from "../../../assets/coins/dai.png";
import MaticLogo from "../../../assets/coins/matic.png";
import { toast } from "react-toastify";
import { withdraw, zeroAddr } from "../../../modules/web3/actions";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../../../modules/web3/config";

export default function Withdraw(prop) {
  const [isDai, setIsDai] = useState(true);
  const amountValue = useRef("");
  const addressValue = useRef("");
  const [loading, setLoading] = useState(false);

  const maxSelect = (e) => {
    e.preventDefault();
    amountValue.current.value = parseInt(prop.withdrawValue);
  };

  const setMyAddress = (e) => {
    e.preventDefault();
    addressValue.current.value = prop.walletAddress;
  };

  const callWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const withdrawTransaction = await withdraw(
        e.target.amount.value,
        e.target.recepient.value,
        isDai
      );
      await waitForTransactionReceipt(config, {
        hash: withdrawTransaction,
      });
      toast.success("Request sent! check your wallet...");
    } catch (err: any) {
      if (
        err.name === "TransactionExecutionError" &&
        /rejected/.test(err.message)
      ) {
        toast.error("User rejected approval");
      } else {
        toast.error(String(err.message));
        console.log(err);
      }
    }
    setLoading(false);
  };
  return (
    <>
      <form
        className={
          "w-[400px] px-4 pb-4 bg-base-100 rounded-b-lg gap-4 flex flex-col"
        }
        onSubmit={callWithdraw}
      >
        <div className={"flex flex-col mt-4"}>
          <div className={"mb-2 flex flex-row items-center justify-between"}>
            <div className="inline justify-start">
              <span className={"font-bold mb-2"}>
                Amount in {isDai ? "DAI" : "MATIC"}:
              </span>
            </div>
            <div className={"flex justify-end"}>
              <span className={"w-fit self-end"}>
                Credit: ${/*prop.upgradeCredits*/}
                <button
                  className={"font-bold text-blue-700 ml-2"}
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
              className="btn input-bordered join-item "
            >
              {isDai ? (
                <img alt={"DAI"} className={"inline w-6"} src={DaiLogo} />
              ) : (
                <img alt={"MATIC"} className={"inline w-6"} src={MaticLogo} />
              )}
            </span>
            <input
              className={"input input-bordered join-item w-[90%]"}
              ref={amountValue}
              disabled={loading}
              type="number"
              name="amount"
            />
            <span className="btn input-bordered join-item ">$</span>
          </div>
        </div>

        <div className={"w-full"}></div>
        <button
          disabled={loading}
          className={"btn border-0 bg-blue-600 text-white/80 rounded-full"}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <span>Withdraw</span>
          )}
        </button>
      </form>
    </>
  );
}
