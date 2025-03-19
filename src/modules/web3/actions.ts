import {
  formatEther,
  parseEther,
  encodePacked,
  keccak256,
  Address,
} from "viem";
import { abiMain, abiUsd } from "./abi";
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
    functionName: "contractinfo",
  });
}

export function getUserInfo(address: string): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "getUser",
    args: [address],
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchInterval: 10000,
    },
  });
}

export function getUserName(address: string): { data: any } {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "addressToUsername",
    args: [address],
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchInterval: 10000,
    },
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
export function withdraw(
  amount: string,
  recepient: `0x{string}`,
  isDai = true
) {
  return writeContract(config, {
    address: contractMainAddr,
    abi: abiMain,
    functionName: "withdraw",
    args: [parseEther(amount), recepient, isDai],
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

export function getTotalUsers() {
  return useReadContract({
    abi: abiMain,
    address: contractMainAddr,
    functionName: "totalUsers",
  });
}
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
