'use client'
    ; (BigInt.prototype as any).toJSON = function () {
        return this.toString()
    }
import { AssetInput } from '@/components/asset-input'
import { Spinner } from '@/components/spinner'
import { sepolia } from '@/config/network';
import { useCurrentChainId } from '@/hooks/useCurrentChainId';
import { getBigint, handleError, parseEthers } from '@/lib/utils'
import { displayBalance } from '@/utils/display'
import { useMutation, useQuery } from '@tanstack/react-query'
import _ from 'lodash'
import { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import { toast } from 'sonner';
import { Address, Hex, encodeAbiParameters, encodePacked, erc20Abi, parseAbi, parseAbiParameters } from 'viem'
import { arbitrum } from 'viem/chains';

import { usePublicClient, useWalletClient } from 'wagmi'

type Token = {
    address: Address,
    symbol: string,
    decimal: number,
}
const SupportNetWork = [sepolia, arbitrum]
type SwapConfig = {
    token0: Token,
    token1: Token,
    hook: Address,
    UniRouter: Address,
    Permit2: Address,
}
const ConfigMap: { [k: number]: SwapConfig } = {
    [sepolia.id]: {
        token0: { symbol: 'SY', address: '0x15BA33F3f6Ddc43cAb51bF705f213C53311e4a6B', decimal: 18 },
        token1: { symbol: 'PT', address: '0xbAA8aBE164616C54D63F7f2Ee750C039c187C36b', decimal: 18 },
        hook: '0xf8a33f6E51F9AA694eeDDBc3De1174D32025aA88',
        UniRouter: '0x3a9d48ab9751398bbfa63ad67599bb04e4bdf98b',
        Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3'
    },

}

const abiUniRouter = parseAbi([
    'function execute(bytes commands,bytes[] inputs,uint256 deadline)'
])
const abiPermit2 = parseAbi([
    'function approve(address token,address spender,uint160 amount,uint48 expiration)',
])


export default function Page() {
    const [inputStr, setInputStr] = useState('')
    const chainId = useCurrentChainId()
    const config = ConfigMap[chainId]
    const hasConfig = Boolean(config)
    const [[tokenA, tokenB], setTokens] = useState([config.token0, config.token1])
    const switchToken = () => {
        setTokens([tokenB, tokenA])
    }
    const PoolKey = {
        currency0: config.token0.address,
        currency1: config.token1.address,
        fee: 3000,
        tickSpacing: 60,
        hooks: config.hook,
    }
    const inputAmountBn = parseEthers(inputStr)
    // const ptOut = 0n
    // const provider = useEthersProvider()
    const { data: wc } = useWalletClient()
    const pc = usePublicClient()
    const is0To1 = config.token0 === tokenA
    const { data: swapOut } = useQuery({
        initialData: 0n,
        queryKey: ['outAmount', inputAmountBn, is0To1],
        enabled: Boolean(pc),
        queryFn: () => {
            if (!pc) return 0n;
            if (inputAmountBn == 0n) return 0n
            const abi = parseAbi(['function getSYtoPTAmountOut(uint256 sYAmount) external view returns (uint256 ptAmount)', 'function getPTtoSYAmountOut(uint256 ptAmount) external view returns (uint256 syAmount)'])
            return pc.readContract({ abi, functionName: is0To1 ? 'getSYtoPTAmountOut' : 'getPTtoSYAmountOut', address: PoolKey.hooks, args: [inputAmountBn] })
        }
    })
    const { data: balances, refetch: refetchBalance } = useQuery({
        initialData: {},
        queryKey: ['getDatas'],
        enabled: Boolean(pc) && Boolean(wc) && hasConfig,
        queryFn: async () => {
            if (!pc || !wc) return {}
            const [token0B, token1B] = await Promise.all([
                pc.readContract({ abi: erc20Abi, functionName: 'balanceOf', address: config.token0.address, args: [wc.account.address] }),
                pc.readContract({ abi: erc20Abi, functionName: 'balanceOf', address: config.token1.address, args: [wc.account.address] })
            ])

            return { [config.token0.address]: token0B, [config.token1.address]: token1B }
        }
    })

    const { mutate, isPending } = useMutation({
        onError: handleError,
        mutationFn: async () => {
            if (isPending || !wc || !pc || swapOut == 0n) return
            const minOut = swapOut * 99n / 100n;
            const confirmations = 3;
            // approve
            const allowance = await pc.readContract({ abi: erc20Abi, functionName: 'allowance', address: tokenA.address, args: [wc.account.address, config.Permit2] })
            if (allowance < inputAmountBn) {
                const hash = await wc.writeContract({ abi: erc20Abi, functionName: 'approve', address: tokenA.address, args: [config.Permit2, parseEthers('10000000000')] })
                await pc.waitForTransactionReceipt({ hash, confirmations })
            }
            const deadline = Math.round((_.now() / 1000) + 60 * 60)
            const hashApprove = await wc.writeContract({ abi: abiPermit2, functionName: 'approve', address: config.Permit2, args: [tokenA.address, config.UniRouter, inputAmountBn, deadline] })
            await pc.waitForTransactionReceipt({ hash: hashApprove, confirmations })
            // swap
            const commands = encodePacked(['uint8'], [0x10])
            /**  uint256 internal constant SWAP_EXACT_IN_SINGLE = 0x06;
    uint256 internal constant SWAP_EXACT_IN = 0x07;
    uint256 internal constant SWAP_EXACT_OUT_SINGLE = 0x08;
    uint256 internal constant SWAP_EXACT_OUT = 0x09; */
            // action, 
            const actions = encodePacked(['uint8', 'uint8', 'uint8'], [0x06, 0x0c, 0x0f])
            const params: Hex[] = ['0x', '0x', '0x']
            params[0] = encodeAbiParameters(
                parseAbiParameters([
                    'ExactInputSingleParams',
                    'struct ExactInputSingleParams { PoolKey poolKey;bool zeroForOne;uint128 amountIn;uint128 amountOutMinimum;bytes hookData;}',
                    'struct PoolKey { address currency0; address currency1 ;uint24 fee; int24 tickSpacing; address hooks;}'
                ]),
                [{
                    poolKey: PoolKey,
                    zeroForOne: is0To1,
                    amountIn: inputAmountBn,
                    amountOutMinimum: minOut,
                    hookData: '0x'
                }]
            )
            params[1] = encodeAbiParameters([{ type: 'address' }, { type: 'uint256' }], [tokenA.address, inputAmountBn])
            params[2] = encodeAbiParameters([{ type: 'address' }, { type: 'uint256' }], [tokenB.address, minOut])


            const inputs: Hex[] = ['0x']
            inputs[0] = encodeAbiParameters([{ type: 'bytes' }, { type: 'bytes[]' }], [actions, params])

            const hashEx = await wc.writeContract({ abi: abiUniRouter, functionName: 'execute', address: config.UniRouter, args: [commands, inputs, BigInt(deadline)] })
            await pc.waitForTransactionReceipt({ hash: hashEx, confirmations })
            setInputStr('')
            toast.success('Transition Success')
            refetchBalance()
        }
    })
    if (!SupportNetWork.find(n => n.id == chainId)) return null
    return <div className="mx-auto w-full max-w-xl flex justify-center items-center pt-10 px-5">
        <div className='flex flex-col items-center gap-2 w-full mx-auto'>
            <AssetInput
                asset={tokenA.symbol}
                amount={inputStr}
                setAmount={setInputStr}
                balance={getBigint(balances, tokenA.address)}

            />

            <div className='flex items-center justify-center w-full'>
                <div className='flex-1' />
                <LuChevronDown className='w-6 h-6 text-neutral-500  border border-neutral-200 rounded-full my-[10px] cursor-pointer' onClick={switchToken} />
                <div className='flex-1' />
            </div>
            <AssetInput
                asset={tokenB.symbol}
                amount={displayBalance(swapOut)}
                balance={getBigint(balances, tokenB.address)}
                checkBalance={false}
                readonly
            />

            <button className='btn-primary flex items-center justify-center gap-4' onClick={() => !isPending && mutate()}>{isPending && <Spinner />}Swap</button>
        </div>
    </div>
}