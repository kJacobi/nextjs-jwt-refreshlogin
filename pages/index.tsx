import Head from 'next/head'
import Header from '../components/header';

// At current time of this project (4/2020), seems to be an error when importing css/scss modules.
// Using the below rather than (import gen from '../assets/styles/general.scss') appears to get around this.
const gen = require('../assets/styles/general.scss');

const HomePage = () => (
  <>
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className={gen.main}>
      <Header />

      <div className={gen.message}>
        This is home
      </div>

    </div>

  </>
)

export default HomePage
