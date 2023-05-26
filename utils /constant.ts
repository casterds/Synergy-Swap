import { SUPPORT_CHAIN_IDS } from "./enums";

export const ATOKEN_ADDRESS: { [key: number]: string } = {
  [SUPPORT_CHAIN_IDS.MUMBAI]: "0x53A4C2f5f3105eEa5db142618D9c9186c81436E3",
  [SUPPORT_CHAIN_IDS.BINANCE]: "0xb5e94535C70264DAd3e9dEeEC91765792AAe408F"
};

export const BTOKEN_ADDRESS: { [key: number]: string } = {
  [SUPPORT_CHAIN_IDS.MUMBAI]: "0xa5262597eC048E640544ea550834F3F958CbF38E",
  [SUPPORT_CHAIN_IDS.BINANCE]: "0x6ddFf89EcC27208582be68b3f91e0B1AF6686A59"
};

export const ORACLE_SWAP_ADDRESS: { [key: number]: string } = {
  [SUPPORT_CHAIN_IDS.MUMBAI]: "0x8f62a65851b772491a34cAd28B4E0Ea298e1b6C3",
  [SUPPORT_CHAIN_IDS.BINANCE]: "0x573Df1765F7d85d273F1bdF50377D6695011C416"
};

export const tokenOptionsPolygon = [
  { id: 1, name: "Synergy (XSC)", value: ATOKEN_ADDRESS[SUPPORT_CHAIN_IDS.MUMBAI] },
  { id: 2, name: "USDC", value: BTOKEN_ADDRESS[SUPPORT_CHAIN_IDS.MUMBAI] }
];

export const tokenOptionsBinance = [
  { id: 1, name: "Synergy (XSC)", value: ATOKEN_ADDRESS[SUPPORT_CHAIN_IDS.BINANCE] },
  { id: 2, name: "USDC", value: BTOKEN_ADDRESS[SUPPORT_CHAIN_IDS.BINANCE] }
];

export const networkOptions = [
  { id: 1, name: "Polygon", value: SUPPORT_CHAIN_IDS.MUMBAI },
  { id: 2, name: "Binance", value: SUPPORT_CHAIN_IDS.BINANCE }
];
