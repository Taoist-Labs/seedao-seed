import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades"
import "hardhat-abi-exporter";
import "hardhat-publish-typechain";

const PRIVATE_KEY = process.env.PRIVATE_KEY || 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: '94QAM6RF43943N3VAAWHZBRYK7GHEPA2G4'
    }
  },
  abiExporter: {
    runOnCompile: true,
    pretty: false,
  },
  publishTypechain: {
    name: "seed-contracts",
    version: "0.1.0",
    ethers: "^5.7.2",
    typescript: "^4.9.5",
    // pretty: false,
    contracts: ["SeeDAO"],
    authToken:
      process.env.PRIVATE_KEY || "npm_pZ...yP",
  },
};

export default config;
