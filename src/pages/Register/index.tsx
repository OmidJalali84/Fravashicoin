import styles from "./register.module.css";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  approveUser,
  getUserInfo,
  getUserInfoByUsername,
  registerUser,
  zeroAddr,
} from "../../modules/web3/actions.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import Path from "../../routes/path.ts";
import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { config } from "../../modules/web3/config.ts";
import { waitForTransactionReceipt } from "wagmi/actions";
import { parseEther } from "ethers/lib/utils";

const { open } = useWeb3Modal();

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { address, isConnected } = useAccount();
  const { data: userInfo } = getUserInfo(address ? address : zeroAddr);

  const [waitWeb3, setWaitWeb3] = useState(false);
  const isLoading = () => isConnected && waitWeb3;

  // Get referral and username params (if any) from URL.
  const refParam = searchParams.get("ref") ?? "";
  const usrParam = searchParams.get("usr") ?? "";

  // New ordering: 0: Connect Wallet, 1: Referral, 2: Approve, 3: Register.
  const [activeStep, setActiveStep] = useState(0);

  // When wallet is connected, always start at Referral step.
  useEffect(() => {
    if (isConnected) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [isConnected]);

  // State for referral and username.
  // For referral step, if the URL has a referral, we auto-fill and disable editing.
  const [refUsername, setRefUsername] = useState(refParam);

  // Amount is used in the approval step.
  const [amount, setAmount] = useState("0");
  // Username for final registration step.
  const [username, setUsername] = useState(usrParam);

  const { data: refInfo } = getUserInfoByUsername(
    refUsername ? refUsername : ""
  );

  // const { data: refAddress } = getUserAddressByUsername(
  //   refUsername ? refUsername : ""
  // );

  useEffect(() => {
    console.log("UserInfo", userInfo);
  }, [userInfo]);

  useEffect(() => {
    console.log("Referral info", refInfo);
  }, [refInfo]);

  // Final submission: if user is already registered, go to dashboard.
  const submitUser = async () => {
    if (!isConnected) {
      open();
      return;
    }

    if (userInfo && userInfo.active) {
      toast.success("You Have Already Registered!");
      console.log(userInfo);
      navigate(Path.DASHBOARD);
      return;
    }

    if (username == "") {
      toast.error("Invalid Username");
      return;
    }

    try {
      setWaitWeb3(true);
      if (Number(amount) >= 10) {
        // Use the referral if provided, or zeroAddr if not.
        const refAddress = refInfo?.userAddress;
        if (!refAddress || refAddress == zeroAddr) {
          toast.error("Invalid Referral");
          return;
        }

        const registerTransaction = await registerUser(
          address,
          refAddress,
          parseEther(amount),
          username.toLowerCase()
        );
        toast.info("Register request sent...");
        await waitForTransactionReceipt(config, {
          hash: registerTransaction,
        });
        toast.info("Registered successfully!");
        navigate(Path.DASHBOARD);
      } else {
        toast.error("Register amount should be greater than 10$");
      }
    } catch (err: any) {
      console.error(err);
      if (err.name === "ContractFunctionExecutionError") {
        if (/exceeds balance/.test(err.message))
          toast.error("Insufficient funds!");
        else if (/no referral by this name/.test(err.message))
          toast.error("Referral username not found!");
        else if (/username must be between/.test(err.message))
          toast.error("Username must be between 3 to 16 characters!");
        else toast.error(err.message);
      }
    }
    setWaitWeb3(false);
  };

  return (
    <main className={"mx-auto max-w-screen-xl"}>
      <div className={"flex flex-col gap-6 pt-12 px-10 mb-10"}>
        <div className={"py-4"}>
          <span className={"font-bold text-2xl"}>
            Register stage in Fravashicoin
          </span>
          <br />
          <span>
            Please connect your wallet and then go through the register process
          </span>
        </div>

        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 0: Connect Wallet */}
          <Step key={0}>
            <StepLabel>
              <span className={styles.label}>Connect Wallet</span>
            </StepLabel>
            <StepContent>
              <Typography className={styles.description}>
                Connect your wallet
              </Typography>
              <button
                disabled={isLoading()}
                className={"btn btn-primary w-full mt-3"}
                onClick={() => open()}
              >
                Continue
              </button>
            </StepContent>
          </Step>

          {/* Step 1: Referral - always shown */}
          <Step key={1}>
            <StepLabel>
              <span className={styles.label}>Referral</span>
            </StepLabel>
            <StepContent>
              <Typography className={styles.description}>
                {refParam
                  ? "Referral detected from URL"
                  : "Enter your referral username (optional)"}
              </Typography>
              <div className={styles.input}>
                <input
                  type="text"
                  name={"referral"}
                  disabled={!!refParam} // if referral was provided via URL, disable editing
                  placeholder={"username"}
                  className={"input input-secondary w-full mt-2"}
                  value={refUsername}
                  onChange={(e) => setRefUsername(e.target.value)}
                />
              </div>
              <button
                disabled={isLoading()}
                className={"btn btn-primary mt-3"}
                onClick={async () => {
                  setWaitWeb3(true);
                  if (refUsername === "faravani sss")
                    setRefUsername("faravani sss");
                  try {
                    if (!refUsername || refUsername.trim() === "") {
                      throw new Error("Referral is required");
                    } else if (!refInfo?.active) {
                      throw new Error("Referral does not exist");
                    }
                    // Move to next step: Approval.
                    setActiveStep(2);
                  } catch (err: any) {
                    toast.error(String(err.message));
                  }
                  setWaitWeb3(false);
                }}
              >
                {isLoading() ? (
                  <span className="loading loading-dots loading-md text-gray-500"></span>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </StepContent>
          </Step>

          {/* Step 2: Approve Register */}
          <Step key={2}>
            <StepLabel>
              <span className={styles.label}>Approve Register</span>
            </StepLabel>
            <StepContent>
              <Typography className={styles.description}>
                Approve the registration amount
              </Typography>
              <input
                type="text"
                name={"amount"}
                placeholder={"Amount"}
                className={"input input-secondary w-full mt-2"}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
              <div className={styles.input}>
                <button
                  disabled={isLoading()}
                  className={"btn btn-primary"}
                  onClick={async () => {
                    if (Number(amount) < 10) {
                      toast.error("Register amount should be greater than 10$");
                      return;
                    }
                    setWaitWeb3(true);
                    try {
                      const amountToApprove = (
                        (Number(amount) * 105) /
                        100
                      ).toString();
                      const approveTransaction = await approveUser(
                        amountToApprove
                      );
                      await waitForTransactionReceipt(config, {
                        hash: approveTransaction,
                      });
                      // Move to the final registration step.
                      setActiveStep(3);
                    } catch (err: any) {
                      if (
                        err.name === "TransactionExecutionError" &&
                        /rejected/.test(err.message)
                      ) {
                        toast.error("User rejected approval");
                      } else {
                        toast.error(String(err.message));
                      }
                    }
                    setWaitWeb3(false);
                  }}
                >
                  {isLoading() ? (
                    <span className="loading loading-dots loading-md text-gray-500"></span>
                  ) : (
                    <span>Approve</span>
                  )}
                </button>
              </div>
            </StepContent>
          </Step>

          {/* Step 3: Register */}
          <Step key={3}>
            <StepLabel>
              <span className={styles.label}>Register</span>
            </StepLabel>
            <StepContent>
              <Typography className={styles.description}>
                Enter your username to finish registration
              </Typography>

              <form onSubmit={submitUser} className={styles.input}>
                <input
                  type="text"
                  name={"username"}
                  placeholder={"username"}
                  className={"input input-secondary w-full"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={isLoading()}
                  className={"btn btn-primary mt-3"}
                  onClick={submitUser}
                >
                  {isLoading() ? (
                    <span className="loading loading-dots loading-md text-gray-500"></span>
                  ) : (
                    <span>Register</span>
                  )}
                </button>
              </form>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    </main>
  );
}

export default Register;
