import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import theme from '../etc/theme'

const MyApp = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>ekonomi</title>
        <link rel='icon' href='/ekonomi.ico' sizes='any' />
        <link rel='icon' href='/ekonomi.png' sizes='any' />
        <link rel='icon' href='/ekonomi.svg' type='image/svg+xml' />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
