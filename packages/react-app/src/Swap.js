import React from "react"
import { useEthers } from "@usedapp/core"
import styles from './styles'
import { delaswapLogo, loadingImg, delaswapLogoText } from './assets'
import { Loader, WalletButton, Exchage } from './components'
import { usePools } from './hooks'

const Swap = () => {

    const [loading, pools] = usePools()
    const { account } = useEthers()
    return (
        <div className={styles.exchangeContainer}>
            <h1 className={styles.headTitle}>DelaSwap 1.0</h1>
            <p className={styles.subTitle}>Exchange tokens</p>
            <div className={styles.exchangeBoxWrapper}>
                {/* swapping box */}
                <div className={styles.exchangeBox}  >
                    <div className="blue_gradient" />
                    <div className={styles.exchange}>
                        {account ? (
                            loading ? (
                                <Loader title="Loading Liqudity Pools please wait" image={loadingImg} />
                            ) : <Exchage pools={pools} />
                        ) : <Loader title="Please connect your wallet" image={delaswapLogoText} />
                        }
                    </div>
                    <div className="blue_gradient" />
                </div>
            </div>

        </div>
    )
}

export default Swap