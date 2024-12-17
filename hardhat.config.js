require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();
require("@nomicfoundation/hardhat-verify");
require("./tasks/index.js");

const {SEPOLIA_URL, ETHER_SCAN_API_KEY, PRI_KEY_1, PRI_KEY_2} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRI_KEY_1, PRI_KEY_2],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHER_SCAN_API_KEY
  },
};
