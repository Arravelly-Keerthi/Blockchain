require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  paths:{
    artifacts:"./src/artifacts",
  },
  network:{
    hardhat:{
      chainId: 31337,
    }
  },
  ipfs: {
    host: 'localhost',
    port: 5001,
    protocol: 'http'
  },
  
};
