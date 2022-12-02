import dynamic from 'next/dynamic'
import Head from 'next/head'
const MintingForm = dynamic(import('../components/form.client'), {ssr: false})
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Testnet NFT minter.</title>
        <meta name="description" content="Testnet NFT minter." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MintingForm></MintingForm>
    </div>
  )
}
