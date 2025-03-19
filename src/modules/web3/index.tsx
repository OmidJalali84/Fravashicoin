import { WagmiProvider } from "wagmi";
import { config } from "./config";

export function Web3Provider({ children }: any) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
