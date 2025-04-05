import React, { useEffect, useState } from "react";
import {
  getPrice,
  getUserBalance,
  getUserDaiBalance,
  zeroAddr,
} from "../../modules/web3/actions";
import { Box, Modal, Tooltip, Slider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SwapModal from "./SwapModal";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

const Swap: React.FC = () => {
  // Two tokens for demonstration.
  const [fromToken, setFromToken] = useState<"DAI" | "FRV">("DAI");
  const [toToken, setToToken] = useState<"FRV" | "DAI">("FRV");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [percent, setPercent] = useState<number>(0);

  const [daiPerFrvPrice, setDaiPerFrvPrice] = useState(NaN);
  const [frvPerDaiPrice, setFrvPerDaiPrice] = useState(NaN);
  const [modalOpen, setModalOpen] = useState(false);

  const { address } = useAccount();

  const { data: price } = getPrice();
  const { data: frvBalance } = getUserBalance(address ? address : zeroAddr);
  const { data: daiBalance } = getUserDaiBalance(address ? address : zeroAddr);

  useEffect(() => {
    if (price) {
      const daiPerFrvPriceValue = Number(price) / 1e18;
      const frvPerDaiPriceValue = 1 / daiPerFrvPriceValue;
      setDaiPerFrvPrice(daiPerFrvPriceValue);
      setFrvPerDaiPrice(frvPerDaiPriceValue);
    }
  }, [price]);

  // Prices for each token.
  const prices: Record<"DAI" | "FRV", number> = {
    FRV: daiPerFrvPrice,
    DAI: frvPerDaiPrice,
  };

  // Compute the converted amount based on token prices.
  const computeToAmount = (amount: number): string => {
    if (isNaN(amount)) return "0.0";
    const converted = amount * prices[fromToken];
    return converted.toFixed(4);
  };

  const checkBalances = (): boolean => {
    if (fromToken === "DAI") {
      return Number(fromAmount) < ((Number(daiBalance) / 1e18) * 100) / 105;
    } else {
      return Number(fromAmount) < ((Number(frvBalance) / 1e18) * 100) / 105;
    }
  };

  // Swap tokens between the "from" and "to" fields.
  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
    setToAmount("");
    setPercent(0);
  };

  const handleOpen = () => {
    if (!fromAmount || !toAmount || fromAmount === "0" || toAmount === "0") {
      toast.error("Invalid Input");
      return;
    }
    if (!checkBalances()) {
      toast.error(`Insufficient ${fromToken} Balance`);
      return;
    }
    setModalOpen(true);
  };

  const handleSetToAmount = (amount: number) => {
    const toAmountValue = computeToAmount(amount);
    setToAmount(toAmountValue);
  };

  // Compute the maximum available balance.
  const getMaxBalance = () => {
    return fromToken === "DAI"
      ? ((Number(daiBalance) / 1e18) * 100) / 105
      : Number(frvBalance) / 1e18;
  };

  // Set the maximum balance for the "from" input.
  const handleSetMax = () => {
    const maxBalance = getMaxBalance();
    setFromAmount(maxBalance.toString());
    handleSetToAmount(maxBalance);
    setPercent(100);
  };

  // Handle slider changes to update the fromAmount based on percentage.
  const handleSliderChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    const newPercent = Array.isArray(newValue) ? newValue[0] : newValue;
    setPercent(newPercent);
    const maxBalance = getMaxBalance();
    const calculatedAmount = (maxBalance * newPercent) / 100;
    setFromAmount(calculatedAmount.toString());
    handleSetToAmount(calculatedAmount);
  };

  // For the Withdraw modal
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "black",
    boxShadow: 24,
    borderRadius: "8px",
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 pt-12 pb-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary">Token Swap</h2>
          <p className="mt-2 text-sm text-gray-400">
            Convert tokens effortlessly on Fravashicoin DEX
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          {/* From Section */}
          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">From</label>
            <input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => {
                setFromAmount(e.target.value);
                handleSetToAmount(parseFloat(e.target.value));
              }}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-400"
            />
            <span className="absolute right-3 top-3 text-secondary font-medium">
              {fromToken}
            </span>
            {/* Balance Display, Set Max Button, and Info Icon */}
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>
                Balance:{" "}
                {fromToken === "DAI" || daiBalance || frvBalance
                  ? Number(daiBalance) / 1e18
                  : Number(frvBalance) / 1e18}
              </span>
              <div className="flex items-center">
                <button
                  onClick={handleSetMax}
                  className="text-teal-300 hover:underline"
                >
                  Set Max
                </button>
                {fromToken === "DAI" && (
                  <Tooltip
                    title="Tip: A 5% fee applies to all buy transactions. Your available balance shown here is adjusted to reflect the net amount after this fee."
                    arrow
                  >
                    <InfoOutlinedIcon
                      fontSize="inherit"
                      className="ml-1 text-teal-300 cursor-pointer"
                    />
                  </Tooltip>
                )}
              </div>
            </div>
            {/* Percent Slider with circle points */}
            <div className="mt-2">
              <Slider
                value={percent}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                aria-labelledby="input-slider"
                min={0}
                max={100}
                marks={[
                  { value: 25, label: "25%" },
                  { value: 50, label: "50%" },
                  { value: 75, label: "75%" },
                ]}
                sx={{
                  color: "#03E5FC",
                  "& .MuiSlider-mark": {
                    height: 10,
                    width: 10,
                    borderRadius: "50%",
                    border: "2px solid white",
                    backgroundColor: "white",
                    transform: "translate(-50%, -50%)",
                  },
                  "& .MuiSlider-markActive": {
                    border: "3px solid #03E5FC",
                    backgroundColor: "white",
                  },
                  "& .MuiSlider-markLabel": {
                    color: "white",
                    fontSize: 12,
                    mt: 1,
                  },
                }}
              />
            </div>
          </div>
          {/* Switch Tokens Button */}
          <button
            onClick={handleSwitchTokens}
            className="w-full flex items-center justify-center gap-2 py-2 border border-teal-300 rounded hover:bg-teal-300 hover:text-gray-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-4-4m4 4l-4 4"
              />
            </svg>
            Swap Tokens
          </button>
          {/* To Section */}
          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">To</label>
            <input
              type="text"
              readOnly
              value={toAmount}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded cursor-not-allowed opacity-70"
            />
            <span className="absolute right-3 top-3 text-secondary font-medium">
              {toToken}
            </span>
          </div>
          {/* Swap Action Button */}
          <button
            onClick={handleOpen}
            className="w-full py-3 bg-gradient-to-r from-teal-300 to-blue-400 text-gray-900 font-bold rounded hover:from-teal-400 hover:to-blue-500 transition-colors"
          >
            Swap
          </button>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(true)}
        hideBackdrop={false}
        disableEscapeKeyDown={true}
      >
        <Box sx={style}>
          <div className="bg-base-100 rounded-t-lg text-end">
            <button
              className="font-bold mt-2 pr-4"
              onClick={() => setModalOpen(false)}
            >
              <CloseIcon className="w-full" />
            </button>
          </div>
          <SwapModal
            isDaiToFrv={fromToken === "DAI"}
            inputAmount={fromAmount}
            outputAmount={toAmount}
          />
        </Box>
      </Modal>
    </main>
  );
};

export default Swap;
