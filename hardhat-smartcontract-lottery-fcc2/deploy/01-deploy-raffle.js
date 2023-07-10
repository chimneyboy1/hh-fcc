const { network, ethers } = require("hardhat")
const { developmentChains, networksConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoodinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoodinatorV2Address = VRFCoordinatorV2Mock.address
        const transactionResponse = await VRFCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        // Fund the subsction
        // Usually, you'd need the link token on a real network
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoodinatorV2Address = networksConfig[chainId]["vrfCoofinatorV2"]
        subscriptionId = networksConfig[chainId]["subscriptionId"]
    }
    const entranceFee = networksConfig[chainId]["entranceFee"]
    const gasLane = networksConfig[chainId]["gasLane"]
    const callbackGaslimit = networksConfig[chainId]["callbackGaslimit"]
    const interval = networksConfig[chainId]["interval"]

    const args = [
        vrfCoodinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGaslimit,
        interval,
    ]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args)
    }
    log("--------------------------")
}

module.exports.tags = ["all", "raffle"]
