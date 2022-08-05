import {
  Flex,
  Heading,
  Box,
  Spacer,
  IconButton,
  Img,
  useColorMode,
  HStack,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'
import { MoonIcon, SearchIcon, SunIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleGetTag = () => {
    if (inputRef.current) {
      router.push(`/tags?id=${inputRef.current.value}`)
    }
  }

  return (
    <>
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
          <HStack spacing='4'>
            <InputGroup>
              <Input
                ref={inputRef}
                placeholder='Get by ID (comma separated)'
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleGetTag()
                  }
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label='Get by ID'
                  icon={<SearchIcon />}
                  onClick={handleGetTag}
                />
              </InputRightElement>
            </InputGroup>
            <IconButton
              aria-label='switch-theme'
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
            />
          </HStack>
        </Flex>
      </nav>
    </>
  )
}

export default NavBar
