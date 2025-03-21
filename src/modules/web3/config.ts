import { createWeb3Modal } from "@web3modal/wagmi/react";
import { http, createConfig } from "wagmi";
import { polygon, arbitrumSepolia } from "wagmi/chains";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";

//changed main and token
export const contractMainAddr = "0x91CDcDeD0C908713A3b093F8a61b968701Bba066";
export const contractUsdAddr = "0x320f0Ed6Fc42b0857e2b598B5DA85103203cf5d3";

// walletconnect
const projectId = "b8479a23d56f952664cd377ed894ed16"; // main
const metadata = {
  name: "FRV",
  description: "FRV",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// wagmi
//added arb config
export const config = createConfig({
  chains: [polygon, arbitrumSepolia],
  transports: {
    [polygon.id]: http(
      "https://polygon-mainnet.g.alchemy.com/v2/gOdtC9qkQfB5fq8LsaEiXDJyCWnEXXzd"
    ),
    [arbitrumSepolia.id]: http(
      "https://arb-sepolia.g.alchemy.com/v2/6xeMd30RpNz54gHUHAg8tXaUbxOuCCZe"
    ),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
  ],
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - false as default
  themeVariables: {
    "--w3m-accent": "#1976d2",
  },
});
