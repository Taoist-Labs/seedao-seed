import hre from "hardhat";
import fs from "fs";
import path from "path";

const network = hre.network.name;
console.log(`current network: ${network}`);

const manifest = path.join(__dirname, network, "contracts.json");
const data = readSync();

function readSync() {
  try {
    const content = fs.readFileSync(manifest, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error(err);
  }
}

function saveSync() {
  const content = JSON.stringify(data, null, 4);
  try {
    fs.writeFileSync(manifest, content);
  } catch (err) {
    console.error(err);
  }
}

// interface Contracts {
//   SeeDAO: string;
// }

// interface DeployedContracts {
//   contracts: Contracts;
//   setContract: (name: string, addr: string) => void;
// }

const deployd = {
  contracts: data,
  setContract: function (name: string, addr: string) {
    this.contracts[name] = addr;
    saveSync();
  },
};

export default deployd;
