import {
  Flex,
  Heading,
  Box,
  Spacer,
  IconButton,
  Img,
  useColorMode,
  HStack
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import React from 'react'
import Head from 'next/head'

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <Head>
        <title>ekonomi</title>
        <link rel='icon' href='/ekonomi.ico' sizes='any' />
        <link rel='icon' href='/ekonomi.png' sizes='any' />
        <link rel='icon' href='/ekonomi.svg' type='image/svg+xml' />
      </Head>
      <nav>
        <Flex minWidth='max-content' p='4'>
          <Box p='2'>
            <Link href='/'>
              <HStack cursor='pointer'>
                <Img src='/ekonomi.svg' alt='ekonomi' width='8' height='8' />
                <Heading size='md'>ekonomi</Heading>
              </HStack>
            </Link>
          </Box>
          <Spacer />
          <IconButton
            aria-label='switch-theme'
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
          />
        </Flex>
      </nav>
    </>
  )
}

export default NavBar
