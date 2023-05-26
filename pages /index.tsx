import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import MintSection from "../components/MintSection";
import SwapSection from "../components/SwapSection";
import NoSsr from "../components/NoSsr";
import PlugConnection from "../components/PluginConnection";
import InfoSection from "../components/InfoSection";
import { useAuth } from "../hooks/useAuth";

const Home: NextPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NoSsr>
      <div className="flex justify-end p-3 space-x-2">
        <PlugConnection />
        <ConnectButton />
      </div>

      <div className={"mt-6 relative"}>
        <SwapSection />
      </div>

      <div className={"mt-12"}>
        <MintSection />
      </div>

      {
        isAuthenticated &&
        <div className={"mt-12 mb-10"}>
          <InfoSection />
        </div>
      }
    </NoSsr>
  );
};

export default Home;
