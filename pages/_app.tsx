import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { polygonAmoy } from "viem/chains";

function MyApp({ Component, pageProps }: AppProps) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const hasPrivyConfig = privyAppId && privyAppId !== "";

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff2"
          as="font"
          crossOrigin=""
        />

        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>Savio - Rotating Savings Protocol</title>
        <meta name="description" content="Savio - The revolutionary on-chain rotating savings protocol" />
      </Head>
      
      {hasPrivyConfig ? (
        <PrivyProvider
          appId={privyAppId}
          config={{
            defaultChain: polygonAmoy,
            supportedChains: [polygonAmoy],
            embeddedWallets: {
              createOnLogin: "all-users",
            },
          }}
        >
          <Component {...pageProps} />
        </PrivyProvider>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-crypto-dark-950 via-crypto-dark-900 to-purple-950 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Savio</span>
            </h1>
            <p className="text-gray-300 mb-6">Rotating Savings Protocol</p>
            <div className="bg-crypto-dark-800/50 backdrop-blur-sm border border-crypto-dark-700 rounded-xl p-6 max-w-md">
              <p className="text-sm text-gray-400">
                ⚠️ Privy configuration required. Please set up your environment variables to continue.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Add NEXT_PUBLIC_PRIVY_APP_ID to your .env.local file
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyApp;
