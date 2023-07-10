const { developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the premium . It costs 0.25 LINK per request
const GAS_PRICE_LINK = 1e9
// 1000000000//calcurated value based on the gas price of the chain.
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        log("Chain ID:", chainId)
        log("Network name:", network.name)

        // deploy a mock vrfcoordinator...helper-hardhat-config.js
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        log("Mocks Deployed")
        log("----------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
