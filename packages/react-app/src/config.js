import { Goerli, BSC } from "@usedapp/core";

export const ROUTER_ADDRESS = "0x37D674A6d93eDDC83866cbF89eD77aEbADA82D4C";

export const DAPP_CONFIG = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: "https://rpc.ankr.com/eth_goerli",
  },
};
