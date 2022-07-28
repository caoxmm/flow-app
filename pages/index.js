import Head from "next/head";
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function Home() {
  const [user, setUser] = useState({ loggedIn: null });
  const [name, setName] = useState(""); // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  // NEW
  const sendQuery = async () => {
    const inited = await fcl.query({
      cadence: `
        import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
        import MatrixWorldVoucher from 0xVOUCHER_ADDRESS

        pub fun main(addr: Address): Bool {
            let ref = getAccount(addr).getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixWorldVoucher.CollectionPublicPath).check()
            return ref
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });

    console.log(inited);
  };

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <button onClick={sendQuery}>Check init</button> {/* NEW */}
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    );
  };

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h1>Flow App</h1>
      {user.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
    </div>
  );
}
