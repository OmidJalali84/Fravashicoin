import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getPrice } from "../../modules/web3/actions";
import { getTokenPrice } from "./utils/getTokenPrice";

interface PriceInterval {
  label: string;
  hours: number;
  price: number | null;
  percentageChange: string;
}

const Price: React.FC = () => {
  const intervals = [
    { label: "1 Hour", hours: 1 },
    { label: "8 Hours", hours: 8 },
    { label: "24 Hours", hours: 24 },
    { label: "1 Week", hours: 24 * 7 },
    { label: "1 Month", hours: 24 * 30 },
    { label: "1 Year", hours: 24 * 365 },
  ];

  const contractDeployedAt = 1742974200; // Replace with your actual deployment timestamp
  const initialPrice = 0.0001;

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceData, setPriceData] = useState<PriceInterval[]>([]);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [customPrice, setCustomPrice] = useState<string | null>(null);
  const [fromStartChanges, setFromStartChanges] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: onchainPrice } = getPrice();

  useEffect(() => {
    if (onchainPrice) {
      const currentPriceValue = Number(
        (Number(onchainPrice) / 1e18).toFixed(6)
      );
      setCurrentPrice(currentPriceValue);
      const fromStart = (
        ((currentPriceValue - initialPrice) / initialPrice) *
        100
      ).toFixed(2);
      setFromStartChanges(fromStart);
    }
  }, [onchainPrice]);

  // Fetch historical prices
  useEffect(() => {
    async function fetchPrices() {
      if (currentPrice !== null) {
        setLoading(true);
        const now = Math.floor(Date.now() / 1000);
        const results: PriceInterval[] = [];

        for (const interval of intervals) {
          const targetTimestamp = now - interval.hours * 3600;
          let price: number | null = null;
          let percentageChange = "N/A";

          if (targetTimestamp < contractDeployedAt) {
            price = null; // not available
          } else {
            const fetchedPrice = await getTokenPrice(targetTimestamp);
            const normalizedPrice = Number(
              (Number(fetchedPrice) / 1e18).toFixed(6)
            );

            if (normalizedPrice !== 0) {
              const change = (
                ((currentPrice - normalizedPrice) / normalizedPrice) *
                100
              ).toFixed(2);
              percentageChange = change;
            }
            price = normalizedPrice;
          }

          results.push({
            label: interval.label,
            hours: interval.hours,
            price,
            percentageChange,
          });
        }
        setPriceData(results);
        setLoading(false);
      }
    }
    fetchPrices();
  }, [currentPrice]);

  // Handle custom date
  const handleCustomDateChange = async (date: Date | null) => {
    setCustomDate(date);
    if (date && currentPrice !== null) {
      const targetTimestamp = Math.floor(date.getTime() / 1000);
      if (targetTimestamp < contractDeployedAt) {
        setCustomPrice("N/A");
        return;
      }
      const fetchedPrice = await getTokenPrice(targetTimestamp);
      const normalizedPrice = Number((Number(fetchedPrice) / 1e18).toFixed(6));
      setCustomPrice(normalizedPrice.toString());
    } else {
      setCustomPrice(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 relative">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary text-center mb-4">
          Price History
        </h1>

        {/* Current Price Card */}
        <div className="mb-6 flex justify-center">
          <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md">
            <span className="text-sm sm:text-base text-gray-300">
              Current Price:{" "}
            </span>
            <span className="font-semibold text-secondary">
              {currentPrice !== null ? `$${currentPrice}` : "Loading..."}
            </span>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-700 border-t-4 border-t-secondary rounded-full animate-spin"></div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-700 mb-4 sm:mb-6">
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr>
                <th className="px-3 sm:px-4 py-2 bg-gray-700 text-secondary font-semibold text-left">
                  Time
                </th>
                <th className="px-3 sm:px-4 py-2 bg-gray-700 text-secondary font-semibold text-left">
                  Price
                </th>
                <th className="px-3 sm:px-4 py-2 bg-gray-700 text-secondary font-semibold text-left">
                  Change (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {priceData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <td className="px-3 sm:px-4 py-2 border-b border-gray-700">
                    {item.label}
                  </td>
                  <td className="px-3 sm:px-4 py-2 border-b border-gray-700">
                    {item.price === null ? "N/A" : `${item.price.toFixed(6)}$`}
                  </td>
                  <td className="px-3 sm:px-4 py-2 border-b border-gray-700">
                    {item.percentageChange === "N/A"
                      ? "N/A"
                      : `${item.percentageChange}% ${
                          parseFloat(item.percentageChange) >= 0 ? "↑" : "↓"
                        }`}
                  </td>
                </tr>
              ))}
              <tr className="hover:bg-gray-700 transition-colors cursor-pointer">
                <td className="px-3 sm:px-4 py-2 border-b border-gray-700">
                  From Start
                </td>
                <td className="px-3 sm:px-4 py-2 border-b border-gray-700">
                  0.0001$
                </td>
                <td className="px-3 sm:px-4 py-2 border-b border-gray-700">
                  {fromStartChanges
                    ? `${fromStartChanges} ${
                        parseFloat(fromStartChanges) >= 0 ? "↑" : "↓"
                      }`
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-lg sm:text-xl text-secondary mb-2">
            Check Price at a Specific Date
          </h2>
          <DatePicker
            selected={customDate}
            onChange={handleCustomDateChange}
            showTimeSelect
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            maxDate={new Date()}
            placeholderText="Select a date and time"
            popperClassName="dark-datepicker-popper"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-teal-300 text-white"
          />
          {customPrice && customDate && (
            <div className="mt-2">
              <strong>Price on {customDate.toLocaleString()}:</strong>{" "}
              {customPrice === "N/A" ? "N/A" : `$${customPrice}`}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Price;
