import { ChakraProvider } from '@chakra-ui/react'
import theme from '../etc/theme'

const MyApp = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
