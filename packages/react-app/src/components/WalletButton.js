import React, { useState, useEffect } from 'react'
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core'
import styles from '../styles'

const WalletButton = () => {
    const { account, activateBrowserWallet, deactivate } = useEthers()
    const { ens } = useLookupAddress
    const [accountAddress, setAccountAddress] = useState('')


    useEffect(() => {
        if (ens) {
            setAccountAddress(ens)
        } else if (account) {
            setAccountAddress(shortenAddress(account))
        } else {
            setAccountAddress("")
        }
    }, [account, ens, setAccountAddress])


    return (
        <button
            className={styles.walletButton}
            onClick={() => {
                if (!account) {
                    activateBrowserWallet();
                } else {
                    deactivate();
                }
            }}
        >
            {accountAddress || "Connect Wallet"}

        </button>
    )
}

export default WalletButton