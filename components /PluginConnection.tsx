import { useAuth } from '../hooks/useAuth';

const PlugConnection = () => {
    const { isAuthenticated, login, logout } = useAuth();

    return (
        <div>
            {
                isAuthenticated ?
                    <div className='bg-[#cf222e] rounded-lg px-3 text-white flex items-center h-10 cursor-pointer' onClick={logout}>Logout</div>
                    :
                    <div className='bg-[#1f883d] rounded-lg px-3 text-white flex items-center h-10 cursor-pointer' onClick={login}>Connect with Internet Identity</div>
                // <PlugConnect
                //     dark
                //     whitelist={[process.env.NEXT_PUBLIC_XSCTOKEN_CANISTER_ID as string]}
                //     title="Connect Plug"
                //     host={process.env.NEXT_PUBLIC_DFX_HOST || "http://localhost:4943"}
                //     onConnectCallback={(args) => {
                //         console.log(args)
                //         setIsConnected(true)
                //     }}
                // />
            }
        </div>
    )
}

export default PlugConnection
