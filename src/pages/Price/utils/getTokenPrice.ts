import { getBlockNumberByTimestamp } from "./findBlockByTimestamp.ts";
import { ethers } from "ethers";

const abiMain = [
  {
    inputs: [],
    name: "price",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractMainAddr = "0x5a739D7aF718f105a41c2A5466812227341ba4e9";

export async function getTokenPrice(targetTimestamp: number) {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mainnet.g.alchemy.com/v2/gOdtC9qkQfB5fq8LsaEiXDJyCWnEXXzd"
  );
  // Create a wallet instance using your private key and connect it to the provider
  const privateKey =
    "28a207254be80cd56b8ef477444113b5d2c53329d0328e10cda6676764fb1b12"; // NEVER expose your real private key in production!
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a ContractFactory for your contract
  const contract = new ethers.Contract(contractMainAddr, abiMain, wallet);

  const blockNumber = await getBlockNumberByTimestamp(targetTimestamp);
  const stateValue = await contract.price({ blockTag: blockNumber });
  console.log(`Price at block ${blockNumber}:`, stateValue.toString());
  return Promise.resolve(Number(stateValue));
}
