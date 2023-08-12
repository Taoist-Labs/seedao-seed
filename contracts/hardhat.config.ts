import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-abi-exporter";
import "dotenv/config";

const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    mainnet: {
      url: "https://eth-mainnet.g.alchemy.com/v2/FU0ujCat3OQd5hIqpddJ94SngVaeSxad",
      chainId: 1,
      accounts: [`${PRIVATE_KEY}`],
    },
    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/-MLinGy2l91vLVZWXmRfNYf9DavMxaEA",
      chainId: 137,
      accounts: [`${PRIVATE_KEY}`],
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/H43zK7UnIN2v7u2ZoTbizIPnXkylKIZl",
      chainId: 11155111,
      accounts: [`${PRIVATE_KEY}`],
    },
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [`${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: "",
      sepolia: "5K6DDRNW3U54VNMVGEPRH7STD3HICUT1CT",
      bscTestnet: "94QAM6RF43943N3VAAWHZBRYK7GHEPA2G4",
    },
  },
  abiExporter: {
    runOnCompile: true,
    pretty: false,
  },
};

export default config;
