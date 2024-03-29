import React, { useState, useEffect } from 'react'
import styles from '../styles'
import { Contract } from '@ethersproject/contracts'
import { abis } from '@my-app/contracts'
import { ERC20, useContractFunction, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core'
import { ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { AmountIn, AmountOut, Balance } from './'
import { ROUTER_ADDRESS } from '../config'
import { getAvailableTokens, getCounterpartTokens, findPoolByTokens, isOperationPending, getFailureMessage, getSuccessMessage } from '../utils'

const Exchange = ({ pools }) => {
    const { account } = useEthers()

    const [fromValue, setFromValue] = useState("0")
    const [fromToken, setFromToken] = useState(pools[0].token0Address)

    const [toToken, setToToken] = useState("")
    const [resetState, setresetState] = useState(false)

    const fromValueBigNumber = parseUnits(fromValue)
    const pairAddress = findPoolByTokens(pools, fromToken, toToken)?.address ?? ""

    const availableTokens = getAvailableTokens(pools)
    const counterpartTokens = getCounterpartTokens(pools, fromToken)

    const routerContract = new Contract(ROUTER_ADDRESS, abis.router02)
    const fromTokenContract = new Contract(fromToken, ERC20.abi)
    const fromTokenBalance = useTokenBalance(fromToken, account)
    const toTokenBalance = useTokenBalance(toToken, account)
    const tokenAllowance = useTokenAllowance(fromToken, account, ROUTER_ADDRESS) || parseUnits("0")
    const approvedNeeded = fromValueBigNumber.gt(tokenAllowance)
    const fromValueIsGreaterThan0 = fromValueBigNumber.gt(parseUnits("0"))
    const hasEnoughBalance = fromValueBigNumber.lte(fromTokenBalance ?? parseUnits("0"))

    const { state: swapApproveState, send: swapApproveSend } = useContractFunction(
        fromTokenContract, "approve", { transactionName: "onApproveRequested", gasLimitBufferPercentage: 10 }
    );

    const { state: swapExecuteState, send: swapExectuteSend } = useContractFunction(
        routerContract, "swapExactTokensForTokens", { transactionName: "swapExactTokensForTokens", gasLimitBufferPercentage: 10 }
    );

    const isApproving = isOperationPending(swapApproveState) // TODO
    const isSwapping = isOperationPending(swapExecuteState)

    const canApprove = !isApproving && approvedNeeded
    const canSwap = !approvedNeeded && !isSwapping && fromValueIsGreaterThan0 && hasEnoughBalance

    const successMessage = getSuccessMessage(swapApproveState, swapExecuteState)
    const failureMessage = getFailureMessage(swapApproveState, swapExecuteState)

    //funcs
    const onApproveRequested = () => {
        swapApproveSend(ROUTER_ADDRESS, ethers.constants.MaxUint256)
    }

    const onSwapRequested = () => {
        swapExectuteSend(
            fromValueBigNumber,
            0,
            [fromToken, toToken],
            account,
            Math.floor(Date.now() / 1000) + 60 * 2
        ).then(() => {
            setFromValue("0")
        })
    }

    const onFromValueChange = (value) => {
        const trimmedValue = value.trim()
        try {
            if (trimmedValue) {
                parseUnits(value)
                setFromValue(value)
            }
        } catch (error) {
            console.log(error)
        }

    }

    const onFromTokenChange = (value) => {
        setFromToken(value)
    }

    const onToTokenChange = (value) => {
        setToToken(value)
    }

    useEffect(() => {
        if (failureMessage || successMessage) {
            setTimeout(() => {
                setresetState(true)
                setFromValue("0")
                setToToken("")
            }, 5000)
        }
    }, [failureMessage, successMessage])


    return (
        <div className='flex flex-col w-full items-center'>
            <div className='mb-8'>
                <AmountIn
                    value={fromValue}
                    onChange={onFromValueChange}
                    currencyValue={fromToken}
                    onSelect={onFromTokenChange}
                    currencies={availableTokens}
                    isSwapping={isSwapping && hasEnoughBalance}
                />
                <Balance tokenBalance={fromTokenBalance} />
            </div>

            <div className='mb-8 w-[100%]'>
                <AmountOut
                    fromToken={fromToken}
                    toToken={toToken}
                    amountIn={fromValueBigNumber}
                    pairContract={pairAddress}
                    currencyValue={toToken}
                    onSelect={onToTokenChange}
                    currencies={counterpartTokens}
                />
                <Balance tokenBalance={toTokenBalance} />
            </div>

            {approvedNeeded && !isSwapping ?
                <button
                    disabled={!canApprove}
                    onClick={onApproveRequested}
                    className={
                        `${canApprove ? "bg-blue-500 text-white" : "bg-site-dim2 text-site-dim2"

                        } ${styles.actionButton}`


                    }
                >
                    {isApproving ? "Approving...." : "Approve"}
                </button>
                : <button
                    disabled={!canSwap}
                    onClick={onSwapRequested}
                    className={
                        `${canSwap ? "bg-blue-500 text-white" : "bg-site-dim2 text-site-dim2"

                        } ${styles.actionButton}`
                    }
                >
                    {isSwapping ? "Swapping...." : "hasEnoughBalance" ? 'Swap' : 'insufficient balance'}
                </button>
            }

            {failureMessage && !resetState ? (
                <p className={styles.message}>{"Transaction Failed"}</p>
            ) : successMessage ? (
                <p className={styles.message}>{"Transaction executed successfully"}</p>
            ) : ""}


        </div>
    )
}

export default Exchange