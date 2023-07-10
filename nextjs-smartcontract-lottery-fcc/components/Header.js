import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div>
            Decentralaized Lottery
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
