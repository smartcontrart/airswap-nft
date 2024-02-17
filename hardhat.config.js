require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    sepolia: {
      url:
        "https://eth-sepolia.g.alchemy.com/v2/" + process.env.ALCHEMY_SEPOLIA,
      chainId: 11155111,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY !== undefined
          ? process.env.DEPLOYER_PRIVATE_KEY
          : "0x1234567890123456789012345678901234567890123456789012345678901234",
      ],
      timeout: 2000000,
    },
  },
  etherscan: {
    apiKey: {
      sepolia:
        process.env.ETHERSCAN_API_KEY !== undefined
          ? process.env.ETHERSCAN_API_KEY
          : "",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.23",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
};
