import Portal from "../components/graphics/portal";
import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  // If no cookie is found, skip any further checks
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    // Use this result to pass props to a page for server rendering or to drive redirects!
    // ref https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props
    console.log({ claims });

    return {
      props: {},
      redirect: { destination: "/dashboard", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  return (
    <>
      <Head>
        <title>Savio - Rotating Savings Protocol</title>
        <meta name="description" content="Join Savio, the on-chain rotating savings protocol. Create or join savings groups, earn yields, and build wealth together." />
      </Head>

      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-gradient-to-br from-blue-50 to-indigo-100 flex-1 p-6 justify-center items-center">
          <div className="max-w-2xl text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to <span className="text-indigo-600">Savio</span>
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                The revolutionary on-chain rotating savings protocol
              </p>
              <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mb-2">1</div>
                    <p>Create or join a savings group</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mb-2">2</div>
                    <p>Contribute USDC and earn 7% yield</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mb-2">3</div>
                    <p>Bid or get randomly selected for lump sum</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 py-4 px-8 text-white rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={login}
              >
                Get Started with Savio
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Connect your wallet or create a smart account to begin
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
