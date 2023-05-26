import "../styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { argentWallet, trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bscTestnet, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { AuthProvider } from "../hooks/useAuth";

const { chains, publicClient, webSocketPublicClient } = configureChains([bscTestnet, polygonMumbai], [publicProvider()]);

const projectId = "YOUR_PROJECT_ID";

const { wallets } = getDefaultWallets({
  appName: "Cross-chain Swap",
  projectId,
  chains
});

const demoAppInfo = {
  appName: "Cross-chain Swap"
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [argentWallet({ projectId, chains }), trustWallet({ projectId, chains }), ledgerWallet({ projectId, chains })]
  }
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
