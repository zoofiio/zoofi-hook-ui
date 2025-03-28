'use client'
  ; (BigInt.prototype as any).toJSON = function () {
    return this.toString()
  }

import HookPage from './hook/page';

export default function Home() {
  return <HookPage />
}
