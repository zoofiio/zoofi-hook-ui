import { HTMLAttributes, ReactNode } from "react"
import { CoinIcon } from "./icons/coinicon"
import { displayBalance } from "@/utils/display"
import { fmtDate } from "@/lib/utils"

function BtnB(p: HTMLAttributes<HTMLButtonElement>) {
    const { children, ...props } = p;
    return <button {...props} className="text-[1em] p-[.75em] w-[12.5em] rounded-[.5em]  cursor-pointer border dark:border-white border-black btn-b">
        {children}
    </button >
}
export function NodeLicenseImage(p: { icon: ReactNode }) {
    return <div className="rounded-2xl border border-black flex flex-col w-[14.375rem] gap-[1.125rem] pt-[1.125rem] bg-white">
        <div className="bg-[#2BBD34] h-[1.875rem] border-y border-black w-full"></div>
        <div className="flex gap-2.5 h-2.5 pl-5">
            <div className="w-[4.75rem] h-full bg-black "></div>
            <div className="w-[1.5625rem] h-full bg-black"></div>
        </div>
        <div className="pl-5 pr-2.5 pb-2 flex flex-col">
            <div className="text-black font-medium text-2xl">Node Licence</div>
            <div className="self-end">
                {p.icon}
            </div>
        </div>
    </div>
}

export type NodeLicense = {
    name: string
    tit: string
    about: string
    totalNodes: bigint
    totalTokenSupply: bigint
    nodeMining: string
    salesStartTime?: number
    tokenTGE?: string
    net: string

}

const nlImages: { [k: string]: { src: string, width: string, height: string } } = {
    'Lnfi': { src: '/lnfi.png', width: '50', height: '20' },
    'Reppo': { src: '/reppo.png', width: '24', height: '24' }
}
export function NodeLicenseInfo({ data }: { data: NodeLicense }) {
    return <div style={{
        backdropFilter: 'blur(20px)'
    }} className="bg-white/5 border border-[#4A5546] rounded-2xl flex flex-col p-7 gap-5 min-h-[25rem]" >
        <div className="flex gap-7">
            <NodeLicenseImage icon={nlImages[data.name] ? <img {...nlImages[data.name]} className="invert" /> : null} />
            <div className="flex flex-col whitespace-nowrap gap-1 text-sm font-medium">
                <div className="text-base font-semibold">{data.tit}</div>
                <div>Total No. of Nodes: {displayBalance(data.totalNodes, 0, 0)}</div>
                <div>Total Token Supply: {displayBalance(data.totalTokenSupply, 0, 0)}</div>
                <div>Node Mining: {data.nodeMining}</div>
                <div>Sales start time: {data.salesStartTime ? fmtDate(data.salesStartTime) : 'TBD'}</div>
                <div>Token TGE: {data.tokenTGE ? data.tokenTGE : 'TBD'}</div>
            </div>
        </div>
        <div className="bg-[#4A5546] h-[1px] w-full shrink-0"></div>
        <div className="flex flex-col gap-2">
            <div className="text-base font-medium">About {data.name}</div>
            <div className="opacity-60 text-sm font-medium leading-normal">{data.about}</div>
        </div>
    </div >
}


function InSvg() {
    return <svg width="60" height="67" viewBox="0 0 60 67" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53.7305 30.0801L26.8652 26.5V40.6973L53.7305 43.5156V30.0801Z" fill="#118C26" />
        <path d="M5.37305 31.1465L26.8652 26.5V42.6191L5.37305 47.2656V31.1465Z" fill="#30CA39" />
        <path d="M30.4453 36.5195L53.7305 30.0801V60.5254L30.4453 66.9648V36.5195Z" fill="#2BBD34" />
        <path d="M5.37305 31.1465L30.4453 36.5195V66.8008L5.37305 60.7012V31.1465Z" fill="#118C26" />
        <path d="M30.4453 36.4727L5.37305 31.1465L0 41.8926L25.9687 47.9922L30.4453 36.4727Z" fill="#2BBD34" />
        <path d="M30.4453 36.5195L53.7305 30.0801L60 40.8262L37.6113 48.1621L30.4453 36.5195Z" fill="#6FE167" />
        <g>
            <path d="M41.5 20L36 21L30 18L34 17L41.5 20Z" fill="#D93E46" />
            <path d="M28 22.5V3L36 1.5V21L41.5 20L31.5 34L21.5 24L28 22.5Z" fill="#F14851" />
            <path d="M21 1L28 3L36 1.5L29 0L21 1Z" fill="#D03B41" />
            <path d="M28 22.5V3L21 1V19.5L28 22.5Z" fill="#9D323D" />
            <path d="M21 19.5L28 22.5L21.5 24L16 20.5L21 19.5Z" fill="#D03B41" />
            <path d="M21.5 24L31.5 34L21 25.5L16 20.5L21.5 24Z" fill="#9E333E" />
        </g>
    </svg>
}
function OutSvg() {
    return <svg width="60" height="65" viewBox="0 0 60 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53.7305 27.5801L26.8652 24V38.1973L53.7305 41.0156V27.5801Z" fill="#118C26" />
        <path d="M5.37305 28.6465L26.8652 24V40.1191L5.37305 44.7656V28.6465Z" fill="#30CA39" />
        <path d="M30.4453 34.0195L53.7305 27.5801V58.0254L30.4453 64.4648V34.0195Z" fill="#2BBD34" />
        <path d="M5.37305 28.6465L30.4453 34.0195V64.3008L5.37305 58.2012V28.6465Z" fill="#118C26" />
        <path d="M30.4453 33.9727L5.37305 28.6465L0 39.3926L25.9687 45.4922L30.4453 33.9727Z" fill="#2BBD34" />
        <path d="M30.4453 34.0195L53.7305 27.5801L60 38.3262L37.6113 45.6621L30.4453 34.0195Z" fill="#6FE167" />
        <g>
            <path d="M30 31V14.5L23 14V29.5L30 31Z" fill="#AAAD16" />
            <path d="M30 14.5V31L37 29V13L42 12L33.5 0L23 16L30 14.5Z" fill="#E5CF3E" />
            <path d="M23 16L33.5 0H27L16.5 14L23 16Z" fill="#BBB73C" />
        </g>
    </svg>

}


export function PrePool({ data }: { data: NodeLicense }) {
    return <div style={{
        backdropFilter: 'blur(20px)'
    }} className="bg-white/5 border border-[#4A5546] rounded-2xl flex flex-col p-7 gap-5" >
        {/* title */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
                <div className="text-xl font-bold">Pre-Deposit Pool</div>
                <div className="text-xs font-medium">Network: {data.net}</div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="opacity-60 text-xs font-medium">Total Deposited</div>
                <div className="text-sm font-medium">
                    <span className="text-2xl font-bold mr-2">{2389}</span>
                    Licenses
                </div>
            </div>
        </div>
        <div className="bg-[#4A5546] h-[1px] w-full shrink-0" />
        {/* deposit withdraw */}
        <div className="flex gap-5 flex-1">
            {/* deposit */}
            <div className="flex-1 flex flex-col justify-between items-center h-full pb-5">
                <div className="self-start">In-Wallet: 12</div>
                <InSvg />
                <BtnB>Deposit</BtnB>
            </div>
            <div className="bg-[#4A5546] w-[1px] h-full shrink-0" />
            {/* withdraw */}
            <div className="flex-1 flex flex-col justify-between items-center h-full pb-5">
                <div className="self-end">Deposited: 12</div>
                <OutSvg />
                <BtnB>Withdraw</BtnB>
            </div>
        </div>
    </div>
}


export function PreDeposit({ data }: { data: NodeLicense }) {
    return <div className="gap-8 w-full grid grid-cols-[4fr_6fr]">
        <NodeLicenseInfo data={data} />
        <PrePool data={data} />
    </div>
}
