import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import theme from '../etc/theme'

const MyApp = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Upload your image, get your tags. - Ekonomi</title>
        <link rel='icon' href='/ekonomi.ico' sizes='any' />
        <link rel='icon' href='/ekonomi.png' sizes='any' />
        <link rel='icon' href='/ekonomi.svg' type='image/svg+xml' />
        <meta property='og:title' content='Ekonomi' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://ekonomi.moe' />
        <meta property='og:image' content='https://ekonomi.moe/ekonomi.png' />
        <meta
          property='og:description'
          content='Upload your image, get your tags.'
        />
        <meta name='description' content='Upload your image, get your tags.' />
        <meta property='og:image:width' content='1024' />
        <meta property='og:image:height' content='1024' />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: light)'
          content='white'
        />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: dark)'
          content='#1A202C'
        />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
