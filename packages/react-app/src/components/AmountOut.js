import React, { useState, useRef, useEffect } from 'react'
import styles from '../styles'
import { chevronDown } from '../assets'
import { useOnClickOutside, useAmountsOut } from '../utils'
import { formatUnits } from 'ethers/lib/utils'

const AmountOut = ({ fromToken,
    toToken,
    amountIn,
    pairContract,
    currencyValue,
    onSelect,
    currencies }) => {
    const [showList, setShowList] = useState(false)

    const [activeCurrency, setactiveCurrency] = useState("Select")

    const ref = useRef()
    useOnClickOutside(ref, () => setShowList(false))

    const amountOut = useAmountsOut(pairContract, amountIn, fromToken, toToken) ?? "0"

    useEffect(() => {
        if (Object.keys(currencies).includes(currencyValue)) {
            setactiveCurrency(currencies[currencyValue])
        } else {
            setactiveCurrency('Select')
        }
    }, [currencies, currencyValue])

    return (
        <div className={styles.amountContainer}>
            <input
                placeholder='0.0'
                type="number"
                value={formatUnits(amountOut)}
                disabled={true}
                onChange={() => { }}
                className={styles.amountInput}
            />

            <div className='relative' onClick={() => setShowList((prevState) => !prevState)}>
                <button className={styles.currencyButton}>
                    {activeCurrency}
                    <img src={chevronDown} className={`w-4 h-4 object-contain ml-2 ${showList ? 'rotate-180' : 'rotate-0'}`} />
                </button>

                {showList && (
                    <ul className={styles.currencyList}>
                        {
                            Object.entries(currencies).map(([token, tokenName], index) => (
                                <li key={index} className={`${styles.currencyListItem}`}
                                    onClick={() => {
                                        if (typeof onSelect === "function") onSelect(token);
                                        setactiveCurrency(tokenName);
                                        setShowList(true);
                                    }}
                                >{tokenName}</li>

                            ))
                        }
                    </ul>
                )}
            </div>
        </div>
    )
}

export default AmountOut