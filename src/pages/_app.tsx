import type { AppProps } from "next/app";
import '@/styles/global.css'
import logoImg from '@/assets/logo.svg'

import Image from "next/image";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className=" flex flex-col items-start justify-center min-h-screen">
      <div className="px-0 py-8 w-full max-w-[1180px] mx-auto my-0">
        <Image src={logoImg} alt="ignite shop" />
      </div>

      <Component {...pageProps} />
    </main>
)
}
