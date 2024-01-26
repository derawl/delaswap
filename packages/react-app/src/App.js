import React, { useEffect } from "react"
import { useEthers } from "@usedapp/core"
import styles from './styles'
import { delaswapLogo, loadingImg, delaswapLogoText } from './assets'
import { Loader, WalletButton,  } from './components'
import Swap from "./Swap"
import Pools from "./Pools"
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import web3 from 'web3'

import { usePools } from './hooks'

const App = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers()
  const [loading, pools] = usePools()

  const chains = [5]

  useEffect(() => {
    const start = async () => {
      if (!chains.includes(window.ethereum.networkVersion)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(chains[0]) }]
          });
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'Polygon Mainnet',
                  chainId: web3.utils.toHex(chains[0]),
                  nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                  rpcUrls: ['https://polygon-rpc.com/']
                }
              ]
            });
          }
        }
      }
    }
    start()
  }, [])


  return <div className={styles.container}>
    <div className={styles.innerContainer}>
      <BrowserRouter>
        <header className={styles.header}>
          <div className="flex flex-row items-center">
            <img src={delaswapLogo}
              className="w-12 h-12"
            />
            <Link to='/'><p className={`${styles.subTitle} toggle-menu cursor-pointer ml-10`}>Swap</p></Link>
            <Link to='/pools'><p className={`${styles.subTitle} toggle-menu cursor-pointer mx-5`}>Pools</p></Link>
          </div>
          <WalletButton />
        </header>

        <Routes>
          <Route path='/' element={<Swap />}></Route>
          <Route path='pools' element={<Pools />}></Route>
        </Routes>


        <div className="flex flex-row items-center my-4">
          <Link to='/'><p className={`${styles.subTitle} toggle-menu-bottom cursor-pointer`}>Swap</p></Link>
          <Link to='/pools'><p className={`${styles.subTitle} toggle-menu-bottom cursor-pointer mx-5`}>Pools</p></Link>
        </div>

      </BrowserRouter>



    </div>
  </div>
}

export default App;