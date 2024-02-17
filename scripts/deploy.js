// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");
var fs = require("fs");

const uri = "https://arweave.net/OqACqPOwxe8uXfa-bUmq78HpsKU-iYHgnMvJQNtMtqE/";
const pubkey = "0x1066c02b5a407612CAF5193Df2540d0C014f34E9";

async function main() {
  const swappy = await hre.ethers.deployContract("Swappy");

  await swappy.waitForDeployment();
  if (!contractsData[hre.network.name]) {
    contractsData[hre.network.name] = { Swappy: {} };
  }
  contractsData[hre.network.name]["Swappy"] = {
    contract: swappy.address,
    arguments: "",
  };

  await swappy.setBaseURI(uri);
  await swappy.batchMint(20, uri);

  storeDeploymentInformation();
}

async function storeDeploymentInformation() {
  !fs.existsSync("./logs") ? fs.mkdirSync("./logs") : undefined;
  fs.writeFileSync(
    `./logs/contractData_${Date.now()}.json`,
    JSON.stringify(contractsData)
  );
  fs.writeFileSync(`./logs/contractsData.json`, JSON.stringify(contractsData));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
