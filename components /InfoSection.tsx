import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Principal } from "@dfinity/principal";

const InfoSection = () => {
    const { xscActor, principal } = useAuth();

    const [amount, setAmount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [targetPrincipal, setTargetPrincipal] = useState("");

    useEffect(() => {
        (async () => {
            if (xscActor && principal) {
                const _balance = await xscActor.balanceOf(principal)
                setBalance(Number(String(_balance)))
            } else {
                setBalance(0);
            }
        })()
    }, [xscActor, principal])

    const onTransferXSC = async () => {
        try {
            if (xscActor) {
                const res = await xscActor.transfer(Principal.from(targetPrincipal), BigInt(amount))
                console.log(res)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="w-[420px] px-4 py-2 bg-gray-200 text-black rounded-lg mx-auto">
            <div className={"font-medium"}>Info</div>

            <div className="mt-3">
                <div className="text-blue">Connected Principal ID:</div>
                <div className="text-blue">{principal?.toString()}</div>
            </div>

            <div className="mt-3">
                <div className="text-blue">XSC Balance:</div>
                <div className="text-blue">{balance}</div>
            </div>

            <input
                value={targetPrincipal}
                onChange={(e) => setTargetPrincipal(e.target.value)}
                className={"bg-white h-8 rounded-lg shadow-md mt-1 w-full px-2 text-sm focus:outline-none"}
            />

            <input
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className={"bg-white h-8 rounded-lg shadow-md mt-1 w-full px-2 text-sm focus:outline-none"}
            />

            <button className={"bg-[#232323] mt-3 text-white h-10 rounded-lg shadow-md w-full px-2 text-sm"} onClick={onTransferXSC}>
                Transfer XSC
            </button>
        </div>
    )
}

export default InfoSection
