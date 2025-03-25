import { formatEther, parseEther, encodePacked, keccak256 } from "viem";
import { abiMain } from "./abi";
import { config, contractMainAddr, contractUsdAddr } from "./config";
import { useReadContract } from "wagmi";
import { readContract, writeContract } from "wagmi/actions";
import { BigNumber } from "ethers";

export const zeroAddr = "0x0000000000000000000000000000000000000000";

export function fmtEther(number: bigint) {
  return parseInt(formatEther(number));
}

export function hashAddr(addr: any) {
  // @ts-ignore
  const hash = keccak256(
    encodePacked(["address", "string"], [addr, "hashMakerNonce"])
  );
  return BigNumber.from(hash).toBigInt(); // Converts hexadecimal to BigInt.
}

export function getAllowanceValue(address: any) {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "allowance",
    args: [address, contractMainAddr],
  });
}

//?

export function getContractInfo() {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "getContractStage",
  });
}

export function getUserInfo(address: string): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "getUser",
    args: [address],
  });
}

export function getUserInfoByUsername(username: string): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "getUserByUsername",
    args: [username],
  });
}

export function getUserAddressByUsername(username: string): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "usernameToAddress",
    args: [username],
  });
}

export function getUserBalance(address: string): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "balanceOf",
    args: [address],
  });
}

export function getUserBalanceByUsername(username: string): { data: any } {
  const address = getUserAddressByUsername(username);
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "balanceOf",
    args: [address],
  });
}

//?
export function getUserStageData(
  username: string = "",
  address: any = zeroAddr,
  stageIndex: number
) {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "userStageData",
    args: [username, hashAddr(address), BigInt(stageIndex)],
  });
}

export function approveUser(amount: string) {
  return writeContract(config, {
    address: contractUsdAddr,
    abi: abiMain,
    functionName: "approve",
    args: [contractMainAddr, parseEther(amount)],
  });
}

export function approveUserFrv(amount: string) {
  return writeContract(config, {
    address: contractMainAddr,
    abi: abiMain,
    functionName: "approve",
    args: [contractMainAddr, parseEther(amount)],
  });
}

export function swapAction(
  address: string,
  amount: string,
  isFRVToDAI: boolean
) {
  return writeContract(config, {
    address: contractMainAddr,
    abi: abiMain,
    functionName: "swap",
    args: [address, isFRVToDAI, parseEther(amount)],
  });
}

export function registerUser(
  address: any,
  address2: any,
  amount: any,
  username: string
) {
  return writeContract(config, {
    address: contractMainAddr,
    abi: abiMain,
    functionName: "register",
    args: [address, address2, amount, username],
  });
}

//?
export function upgradePlan(amount: string) {
  return writeContract(config, {
    address: contractMainAddr,
    abi: abiMain,
    functionName: "upgradePlan",
    args: [parseEther(amount)],
  });
}

//?
export function getAutoReferral(username: string = "") {
  return readContract(config, {
    abi: abiMain,
    address: contractMainAddr,
    functionName: "autoReferral",
    args: [username],
  });
}

export function upgradeUser(address: any, amount: string = "0") {
  return writeContract(config, {
    address: contractMainAddr,
    abi: abiMain,
    functionName: "upgradePlan",
    args: [address, amount],
  });
}

//?
export function userTree(username: string = "", level: number = 0) {
  return readContract(config, {
    address: contractMainAddr,
    abi: abiMain,
    functionName: "userTree",
    args: [username, BigInt(level)],
  });
}

///Added by me

export function getUserInfoWithUsername(username: string = ""): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "getUserByUsername",
    args: [username],
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchInterval: 10000,
    },
  });
}

export function getUnlockedAmount(address: string = zeroAddr): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "unlockedAmount",
    args: [address],
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchInterval: 10000,
    },
  });
}

export function getLockedAmount(address: string = zeroAddr): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "lockedAmount",
    args: [address],
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchInterval: 10000,
    },
  });
}

export function getPrice(): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "price",
    args: [],
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchInterval: 10000,
    },
  });
}
