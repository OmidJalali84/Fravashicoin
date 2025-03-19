import styles from "./register.module.css";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  approveUser,
  fmtEther,
  getAllowanceValue,
  getUserInfo,
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
  const isLoading = () => {
    return isConnected && waitWeb3;
  };

  const [activeStep, setActiveStep] = useState(isConnected ? 1 : 0);

  useEffect(() => {
    if (!isConnected) setActiveStep(0);
    else if (activeStep === 0) setActiveStep(1);
  }, [isConnected]);

  useEffect(() => {
    console.log(userInfo); // Log the structure of userInfo
  }, [userInfo]);

  const [refUsername, setRefUsername] = useState(searchParams.get("ref") ?? "");
  const [username, setUsername] = useState(searchParams.get("usr") ?? "");
  const [hasReferral, setHasReferral] = useState(false); // New state for check mark
  const [amount, setAmount] = useState("0");

  const { data: refInfo } = getUserInfo(refUsername ? refUsername : zeroAddr);

  const submitUser = async () => {
    // if not connected to walletconnect open dialog
    if (!isConnected) {
      open();
      return;
    }

    if (userInfo && userInfo.active == true) {
      toast.success("You Have Already Registered!");
      navigate(Path.DASHBOARD);
      return;
    }

    try {
      setWaitWeb3(true);
      if (amount >= "10") {
        const referral = hasReferral ? refUsername : zeroAddr;

        const registerTransaction = await registerUser(
          address,
          referral,
          parseEther(amount),
          username.toLowerCase()
        );

        toast.info("Register request sent...");
        await waitForTransactionReceipt(config, {
          hash: registerTransaction,
        });
        await toast.info("Registered successfully!");
        navigate(Path.DASHBOARD);
      } else {
        toast.error("Register amount should be greater than 10$")
      }
    } catch (err: any) {
      console.log(err);
      if (err.name === "ContractFunctionExecutionError") {
        switch (true) {
          case /exceeds balance/.test(err.message):
            toast.error("Insufficient funds!");
            break;
          case /no referral by this name/.test(err.message):
            toast.error("Referral username not found!");
            break;
          case /username must be between/.test(err.message):
            toast.error("Username must be between 3 to 16 characters!");
            break;
          default:
            toast.error(err.message);
            console.error(err);
        }
      }
    }

    setWaitWeb3(false);
  };

  const checkReferralUser = () => {
    return refInfo?.active;
  };

  return (
    <main className={"mx-auto max-w-screen-xl"}>
      <div className={"flex flex-col gap-6 pt-12 px-10 mb-10"}>
        <div className={"py-4"}>
          <span className={"font-bold text-2xl "}>Register stage in Rifex</span>
          <br />
          <span>
            Please connect your wallet and then go through the register process
          </span>
        </div>

        <Stepper activeStep={activeStep} orientation="vertical">
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

          <Step key={1}>
            <StepLabel>
              <span className={styles.label}>Approve Register</span>
            </StepLabel>
            <StepContent>
              <Typography className={styles.description}>
                Approve the amount for it
              </Typography>
              <input
                type="text"
                name={"amount"}
                disabled={searchParams.get("ref") ? true : false}
                placeholder={"Amount"}
                className={"input input-secondary w-full mt-2"}
                defaultValue={0}
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
                    } else {
                      setWaitWeb3(true);
                      try {
                        const amountToApprove = (Number(amount) * 105 / 100).toString()
                        const approveTransaction = await approveUser(amountToApprove);
                        await waitForTransactionReceipt(config, {
                          hash: approveTransaction,
                        });
                        if (approveTransaction) {
                          setActiveStep(2);
                        }
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
                    }
                  }}
                >
                  {isLoading() ? (
                    <span className="loading loading-dots loading-md text-gray-500"></span>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </StepContent>
          </Step>

          <Step key={2}>
            <StepLabel>
              <span className={styles.label}>Referral</span>
            </StepLabel>
            <StepContent>
              <Typography className={styles.description}>
                Do you have a referral?
              </Typography>
              <div className={styles.input}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasReferral}
                    onChange={(e) => {
                      setHasReferral(e.target.checked);
                      console.log(e.target.checked);
                    }}
                    className="checkbox"
                  />
                  <span>Yes, I have a referral</span>
                </label>

                {hasReferral && (
                  <input
                    type="text"
                    name={"referral"}
                    disabled={searchParams.get("ref") ? true : false}
                    placeholder={"username"}
                    className={"input input-secondary w-full mt-2"}
                    defaultValue={refUsername}
                    onChange={(e) => {
                      setRefUsername(e.target.value);
                    }}
                  />
                )}

                <button
                  disabled={isLoading()}
                  className={"btn btn-primary mt-3"}
                  onClick={async () => {
                    setWaitWeb3(true);
                    try {
                      if (!hasReferral) {
                        setRefUsername(zeroAddr);
                        setActiveStep(3);
                      } else {
                        if (checkReferralUser()) {
                          setActiveStep(3);
                        } else throw new Error("Referral Is Not Valid");
                      }
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
              </div>
            </StepContent>
          </Step>

          <Step key={3}>
            <StepLabel>
              <span className={styles.label}>Register</span>
            </StepLabel>
            <StepContent>
              <Typography className={styles.description}>
                Enter your username
              </Typography>

              <form onSubmit={submitUser} className={styles.input}>
                <input
                  type="text"
                  name={"username"}
                  placeholder={"username"}
                  className={"input input-secondary w-full"}
                  defaultValue={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
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
