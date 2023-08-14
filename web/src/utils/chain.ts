import { AddEthereumChainParameter } from "@web3-react/types";
const CHAIN: { [key: string]: AddEthereumChainParameter } = {
  BSC_TESTNET: {
    chainId: 97,
    chainName: "BNB Smart Chain Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [],
  },
  SEPOLIA: {
    chainId: 11155111,
    chainName: "Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.sepolia.io"],
  },
};
export default CHAIN;
