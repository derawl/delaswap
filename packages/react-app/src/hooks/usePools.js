import Web3 from 'web3'
import { useState, useEffect } from 'react'
import { useConfig } from '@usedapp/core'
import { ROUTER_ADDRESS } from '../config'
import { providers } from 'ethers'
import { getFactoryInfo, getRouterInfo } from '../utils'

export const loadPools = async (providerUrl) => {

    const provider = new Web3.providers.HttpProvider(providerUrl)
    const web3 = new Web3(provider)

    //grabing the router and factory info
    const routerInfo = await getRouterInfo(ROUTER_ADDRESS, web3);
    const factoryInfo = await getFactoryInfo(routerInfo.factory, web3);

    console.log(factoryInfo)
    return factoryInfo.pairsInfo
}

export const usePools = () => {

    const { readOnlyChainId, readOnlyUrls } = useConfig()

    console.log(readOnlyChainId)
    const [loading, setLoading] = useState(true)
    const [pools, setPools] = useState({})


    useEffect(() => {
        loadPools(readOnlyUrls[readOnlyChainId]).then((pools) => {
            setPools(pools);
            setLoading(false)
        })
    }, [readOnlyChainId, readOnlyUrls])


    return [loading, pools];
}
