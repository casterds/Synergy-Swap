/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAccount, useContractRead, useContractWrite, useNetwork, useSwitchNetwork, useWaitForTransaction, useWalletClient } from "wagmi";
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from "@axelar-network/axelarjs-sdk";
import { BigNumber, ethers } from "ethers";
import { createBigInt } from "@metamask/utils";
import Dropdown, { Item } from "./Dropdown";
import {
  ATOKEN_ADDRESS,
  BTOKEN_ADDRESS,
  networkOptions,
  ORACLE_SWAP_ADDRESS,
  tokenOptionsBinance,
  tokenOptionsPolygon
} from "../utils/constant";
import { SUPPORT_CHAIN_IDS } from "../utils/enums";
import ORACLE_SWAP_ABI from "../utils/abis/OracleSwap.json";
import ERC20_ABI from "../utils/abis/ERC20.json";

const SwapSection = () => {
  const [amount, setAmount] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [sourceToken, setSourceToken] = useState<Item>(tokenOptionsBinance[0]);
  const [sourceNetwork, setSourceNetwork] = useState<Item>(networkOptions[1]);
  const [targetToken, setTargetToken] = useState<Item>(tokenOptionsPolygon[0]);
  const [targetNetwork, setTargetNetwork] = useState<Item>(networkOptions[0]);
  const [allowanceEnough, setAllowanceEnough] = useState(false);

  const { chain } = useNetwork();
  const { address } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { data: walletClient} = useWalletClient();
  const { data: allowanceData, refetch } = useContractRead({
    address: `0x${String(chain && (sourceToken.id === 1 ? ATOKEN_ADDRESS[chain.id] : BTOKEN_ADDRESS[chain.id])).substring(2)}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, ORACLE_SWAP_ADDRESS[chain ? chain.id : SUPPORT_CHAIN_IDS.MUMBAI]]
  });
  const {
    writeAsync: swapRemoteCall,
    data: swapData,
    isSuccess: swapSuccess
  } = useContractWrite({
    address: `0x${ORACLE_SWAP_ADDRESS[chain ? chain.id : SUPPORT_CHAIN_IDS.MUMBAI].substring(2)}`,
    abi: ORACLE_SWAP_ABI,
    functionName: "swapRemote"
  });
  const {
    data: approveData,
    writeAsync: approveCall
  } = useContractWrite({
    address: `0x${String(chain && (sourceToken.id === 1 ? ATOKEN_ADDRESS[chain.id] : BTOKEN_ADDRESS[chain.id])).substring(2)}`,
    abi: ERC20_ABI,
    functionName: "approve"
  });
  const { isSuccess: approveSuccess } = useWaitForTransaction({
    hash: approveData?.hash
  });

  const onApprove = async () => {
    if (!chain || !walletClient || !address) return;

    try {
      const spendAmount = ethers.utils.parseEther(amount.toString());

      if (!BigNumber.from(String(allowanceData || 0)).gte(spendAmount)) {
        await approveCall({
          args: [ORACLE_SWAP_ADDRESS[chain.id], ethers.utils.parseEther(amount.toString())]
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSwap = async () => {
    if (!chain || !walletClient || !address) return;

    try {
      const spendAmount = ethers.utils.parseEther(amount.toString());
      setSwapping(true);
      const estimateGasUsed = 400000;

      const sdk = new AxelarQueryAPI({
        environment: Environment.TESTNET
      });

      const gasFee = await sdk.estimateGasFee(
        chain.id === SUPPORT_CHAIN_IDS.BINANCE ? EvmChain.BINANCE : EvmChain.POLYGON,
        chain.id === SUPPORT_CHAIN_IDS.BINANCE ? EvmChain.POLYGON : EvmChain.BINANCE,
        chain.id === SUPPORT_CHAIN_IDS.BINANCE ? GasToken.BINANCE : GasToken.MATIC,
        estimateGasUsed
      );

      await swapRemoteCall({
        args: [
          targetNetwork.value === SUPPORT_CHAIN_IDS.MUMBAI ? "Polygon" : "Binance",
          ORACLE_SWAP_ADDRESS[Number(targetNetwork.value)],
          sourceToken.id === 1 ? ATOKEN_ADDRESS[chain.id] : BTOKEN_ADDRESS[chain.id],
          targetToken.id === 1 ? ATOKEN_ADDRESS[chain.id] : BTOKEN_ADDRESS[chain.id],
          spendAmount
        ],
        value: createBigInt(Number(gasFee))
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSwapping(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (switchNetworkAsync) {
        try {
          await switchNetworkAsync(Number(sourceNetwork.value));
          setSourceToken(sourceNetwork.value === SUPPORT_CHAIN_IDS.MUMBAI ? tokenOptionsPolygon[0] : tokenOptionsBinance[0]);
          setTargetNetwork(sourceNetwork.value === SUPPORT_CHAIN_IDS.MUMBAI ? networkOptions[1] : networkOptions[0]);
        } catch (e) {
          setSourceNetwork(networkOptions[1]);
          console.error(e);
        }
      }
    })();
  }, [sourceNetwork, switchNetworkAsync]);

  useEffect(() => {
    setTargetToken(targetNetwork.value === SUPPORT_CHAIN_IDS.MUMBAI ? tokenOptionsPolygon[0] : tokenOptionsBinance[0]);
  }, [targetNetwork]);

  useEffect(() => {
    setAllowanceEnough(allowanceData ? BigNumber.from(String(allowanceData)).gte(ethers.utils.parseEther(amount.toString())) : false);
  }, [amount, allowanceData]);

  useEffect(() => {
    refetch().then((e) => null);
  }, [approveSuccess]);

  return (
    <div className={"w-[420px] px-4 py-2 bg-gray-200 text-black rounded-lg mx-auto"}>
      <div className={"font-medium"}>Swap</div>

      <div className={"mt-5 text-xs"}>From</div>
      <div className={"flex items-center justify-between space-x-3"}>
        <div className={"basis-2/3 w-full"}>
          <Dropdown
            options={sourceNetwork.value === SUPPORT_CHAIN_IDS.MUMBAI ? tokenOptionsPolygon : tokenOptionsBinance}
            defaultOption={sourceToken}
            selected={sourceToken}
            onChange={(option) => setSourceToken(option)}
          />
        </div>
        <div className={"basis-1/3 w-full"}>
          <Dropdown
            options={networkOptions}
            defaultOption={networkOptions[1]}
            selected={sourceNetwork}
            onChange={(option) => setSourceNetwork(option)}
          />
        </div>
      </div>

      <div className={"mt-5 text-xs"}>To</div>
      <div className={"flex items-center justify-between space-x-3"}>
        <div className={"basis-2/3 w-full"}>
          <Dropdown
            options={targetNetwork.value === SUPPORT_CHAIN_IDS.MUMBAI ? tokenOptionsPolygon : tokenOptionsBinance}
            defaultOption={targetToken}
            selected={targetToken}
            onChange={(option) => setTargetToken(option)}
          />
        </div>
        <div className={"basis-1/3 w-full"}>
          <Dropdown
            options={networkOptions}
            defaultOption={networkOptions[0]}
            selected={targetNetwork}
            onChange={(option) => setTargetNetwork(option)}
          />
        </div>
      </div>

      <div className={"mt-5 text-xs"}>Total Amount</div>
      <input
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={"bg-white h-8 rounded-lg shadow-md mt-1 w-full px-2 text-sm focus:outline-none"}
      />

      {!allowanceEnough && (
        <div className={"mt-12"}>
          <button className={"bg-[#232323] text-white h-10 rounded-lg shadow-md w-full px-2 text-sm"} onClick={onApprove}>
            {swapping ? "Approve In progress" : "Approve"}
          </button>
        </div>
      )}

      {allowanceEnough && (
        <div className={"mt-12"}>
          <button
            className={"bg-[#232323] text-white h-10 rounded-lg shadow-md w-full px-2 text-sm"}
            onClick={onSwap}
            disabled={swapping || amount === 0}
          >
            {swapping ? "Swap In progress" : "Swap"}
          </button>
        </div>
      )}

      {swapSuccess && (
        <div className={"mt-2 flex items-center justify-center"}>
          <a href={`https://testnet.axelarscan.io/gmp/${swapData?.hash}`} target={"_blank"} rel='noreferrer'>
            Link to Axelar Explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default SwapSection;
