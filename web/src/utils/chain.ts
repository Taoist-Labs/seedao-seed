const CHAIN: any = {
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
  POLYGON: {
    chainId: 137,
    chainName: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ['https://polygon-mainnet.g.alchemy.com/v2/YuNeXto27ejHnOIGOwxl2N_cHCfyLyLE',"https://polygon.llamarpc.com","https://rpc-mainnet.maticvigil.com"],
  },
  ETHEREUM: {
    chainId: 1,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://eth-mainnet.g.alchemy.com/v2/ml_RMvREN9YBOh0R8jX6w6nugRIj9sfT","https://cloudflare-eth.com", "https://rpc.flashbots.net/"],
  },
};
export default CHAIN;
