import { abis } from "@my-app/contracts"

export const getRouterInfo = async (routerAddres, web3) => {
    const router = new web3.eth.Contract(abis.router02, routerAddres)

    return {
        factory: await router.methods.factory().call()
    }
}