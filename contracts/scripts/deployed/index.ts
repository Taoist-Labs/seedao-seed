import hre from "hardhat";
import fs from "fs";
import path from "path";

// read json file
function readSync() {
  try {
    const content = fs.readFileSync(manifest, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error(err);
  }
}

// write json file
function saveSync() {
  const content = JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(manifest, content);
  } catch (err) {
    console.error(err);
  }
}

const network = hre.network.name;
console.log('current network: ', network);

// const [signer] = await ethers.getSigners();
// console.log('current signer: ', signer.address);

const manifest = path.join(__dirname, network, "contracts.json");
const data = readSync();

const deployd = {
  contracts: data,
  setSeedContract: function (addr: string) {
    this.contracts["Seed"] = addr;
    saveSync();
  },
  getSeedContract: function (): string {
    return this.contracts["Seed"];
  },
  setSeedMinterContract: function (addr: string) {
    this.contracts["SeedMinter"] = addr;
    saveSync();
  },
  getSeedMinterContract: function (): string {
    return this.contracts["SeedMinter"];
  },
  setMockPointsContract: function (addr: string) {
    this.contracts["mock"]["MockPoints"] = addr;
    saveSync();
  },
  getMockPointsContract: function (): string {
    return this.contracts["mock"]["MockPoints"];
  },
};

export default deployd;