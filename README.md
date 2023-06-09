## SynergySwap

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Functionalities

- [x] Connect wallet using your wallet
- [x] Showing native balance
- [x] Mint interface for testing purpose for XSC & USDC tokens
- [x] Swap interface for XSC & USDC tokens
- [x] Approving selected Token if allowance is not enough
- [x] swapRemote function call with fee calculation


### working
- Prettier & eslint configuration on the project
- Build based on next.js + rainbowkit + tailwind.css to provide wallet connection

# Details for TokenA and TokenB
They are just simple mockERC20 token contract extended from openzeppelin. It has 18 decimals and mint function for testing purpose. and they are deployed on both of chains (BSC testnet & mumbai testnet)

# How swap works
When calling swapRemote function in OracleSwap contract, first of all, the user have to approve the contract to spend the amount of token that user want to swap. Then, the contract will lock the token and send the message to destination chain by calling gateway.callContract function inside swapRemote itself.
On the destination chain, once the gateway is received the message from source chain, it will run _execute function defined in OracleSwap contract. Then, the contract will transfer the token to the user
Additionally, the token prices are defined as static variable in OracleSwap contract.

## Deploy on internetcomputer
After you generate static website using `yarn build` or `npm run build`, you can deploy the website on internetcomputer using `dfx deploy` command. You can find more details on [internetcomputer.org](https://internetcomputer.org/docs/current/samples/host-a-website)

After deployment, you will have to look up hosted website id by running `yarn lookup-id`. Find more details on [here](https://internetcomputer.org/docs/current/samples/host-a-website#see-your-live-website)

* If you are using local network, deployment link should be like this.
http://127.0.0.1:4943/?canisterId=rrkah-fqaaa-aaaaa-aaaaq-cai

# Deployment on testnet : 
https://icscan.io/canister/vn7bk-uaaaa-aaaak-qcetq-cai 
