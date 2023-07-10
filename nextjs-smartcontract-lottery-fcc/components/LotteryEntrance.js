// have a function to enter the lottery

import { useWeb3Contract } from "react-moralis"
// import { Contract } from "web3uikit"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { getWrappedNative } from "web3uikit"
import { useEffect } from "react"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, Moralis } = useMoralis()
    const chainId = parseInt(chainIdHex) // "PaeseInt" make the number from hex code
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    console.log(raffleAddress)

    // const { runContractFunction: enterRaffle } = useWeb3Contract({
    //     abi: abi,//,
    //     contractAddress: raffleAddress,
    //     function:"enterRaffle",
    //     params: {},//
    //     msgValue://
    // })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi, //,
        contractAddresses: raffleAddress,
        function: "getEntranceFee",
        params: {}, //
    })
    console.log(getEntranceFee)

    let entranceFee = ""

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                // const something = await getEntranceFee()
                // console.log(something)
                entranceFee = await getEntranceFee()
                // console.log(entranceFee)
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            Hi from Lottery entranceFee!<div>{entranceFee}</div>
        </div>
    )
}
