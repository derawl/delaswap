import React from "react"
import { useEthers } from "@usedapp/core"
import styles from './styles'
import { delaswapLogoText, butterFlyLoading } from './assets'
import { Loader } from './components'

const Pools = () => {
    const { account } = useEthers()
    return (
        <div className={styles.exchangeContainer}>
            <h1 className={styles.headTitle}>DelaSwap 1.0</h1>
            <p className={styles.subTitle}>Liquidity Pools</p>
            <div className={styles.exchangeBoxWrapper}>
                {/* swapping box */}
                <div className={styles.exchangeBox}  >
                    <div className="blue_gradient" />
                    <div className={styles.exchange}>
                        {account ? <Loader title="Coming soon..." image={butterFlyLoading} /> : <Loader title="Please connect your wallet" image={delaswapLogoText} />
                        }
                    </div>
                    <div className="blue_gradient" />
                </div>
            </div>

        </div>
    )
}

export default Pools