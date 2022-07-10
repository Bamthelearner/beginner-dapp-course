import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Nav from '../components/Nav.jsx';
import { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import "../flow/config.js";


export default function Home() {
  const [newGreeting, setNewGreeting] = useState('');
  const [greeting, setGreeting] = useState('');
  const [number, setNumber] = useState('');
  const [numberInput, setNumberInput] = useState('');
  const [txStatus, setTxStatus] = useState('Run Transaction');

  async function executeScript() {
    const response = await fcl.query({
      cadence: `
      import HelloWorld from 0xc516ecbec2e88547 
  
      pub fun main(): String {
          return HelloWorld.greeting
      }
      `,
      args: (arg, t) => [] // ARGUMENTS GO IN HERE
    })

    console.log("Response from our script: " + response);
    setGreeting(response)
  }

  async function executeNumberScript() {
    const response = await fcl.query({
      cadence: `
      import SimpleTest from 0x6c0d53c676256e8c 
  
      pub fun main(): Int {
          return SimpleTest.number
      }
      `,
      args: (arg, t) => [] // ARGUMENTS GO IN HERE
    })

    setNumber(response)
  }

  useEffect(() => {
    executeScript()
    executeNumberScript()
  }, [])

  async function runTransaction() {
    const transactionId = await fcl.mutate({
      cadence: `
      import HelloWorld from 0xc516ecbec2e88547
  
      transaction(myNewGreeting: String) {
  
        prepare(signer: AuthAccount) {}
  
        execute {
          HelloWorld.changeGreeting(newGreeting: myNewGreeting)
        }
      }
      `,
      args: (arg, t) => [
        arg(newGreeting, t.String)
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999
    })

    fcl.tx(transactionId).subscribe(res => {
      console.log(res);
      if (res.status === 0 || res.status === 1) {
        setTxStatus('Pending...');
      } else if (res.status === 2) {
        setTxStatus('Finalized...')
      } else if (res.status === 3) {
        setTxStatus('Executed...');
      } else if (res.status === 4) {
        setTxStatus('Sealed!');
        setTimeout(() => setTxStatus('Run Transaction'), 2000); // We added this line
      }
    })

    await fcl.tx(transactionId).onceSealed();
    executeScript();
    console.log("Here is the transactionId: " + transactionId);


  }

  async function runNumberTransaction() {
    const transactionId = await fcl.mutate({
      cadence: `
      import SimpleTest from 0x6c0d53c676256e8c
  
      transaction(number: Int) {
  
        prepare(signer: AuthAccount) {}
  
        execute {
          SimpleTest.updateNumber(newNumber: number)
        }
      }
      `,
      args: (arg, t) => [
        arg(numberInput, t.Int)
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999
    })

    await fcl.tx(transactionId).onceSealed();
    executeNumberScript();
    console.log("Here is the transactionId: " + transactionId);
  }

  return (
    <div>
      <Head>
        <title>Emerald DApp</title>
        <meta name="description" content="Created by Emerald Academy" />
        <link rel="icon" href="https://i.imgur.com/hvNtbgD.png" />
      </Head>

      <Nav />

      <div className={styles.welcome}>
        <h1 className={styles.title}>
          Welcome to my <a href="https://academy.ecdao.org" target="_blank">Emerald DApp!</a>
        </h1>
        <p>This is a DApp created by <p className={styles.p}>Jacob Tucker (<i>tsnakejake#8364</i>).</p></p>
      </div>

      <main className={styles.main}>
        <p>{greeting}</p>
        <div className={styles.flex}>
          <input onChange={(e) => setNewGreeting(e.target.value)} placeholder="Hello, Idiots!" />
          <button onClick={runTransaction}>{txStatus}</button>
        </div>
      </main>
    </div >
  )
}

