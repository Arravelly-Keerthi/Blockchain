// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Agent contract with the account:", deployer.address);

  const Agent = await ethers.getContractFactory("Agent");
  const agent = await Agent.deploy();
/*
  const Migrations = await ethers.getContractFactory("Migrations");
  const migrations = await Migrations.deploy();
  */

  console.log("Agent contract deployed to:", agent.address);
 // console.log("Migrations contract deployed to:", migrations.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
