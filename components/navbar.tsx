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
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { HamburgerIcon, MoonIcon, SearchIcon, SunIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const mobileInputRef = React.useRef<HTMLInputElement>(null)

  const handleGetTag = () => {
    if (inputRef.current) {
      console.log(inputRef.current.value)
      router.push(`/tags?id=${inputRef.current.value}`)
    }
  }

  const handleGetTagOnMobile = () => {
    if (mobileInputRef.current) {
      router.push(`/tags?id=${mobileInputRef.current.value}`)
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
          <Box>
            <HStack spacing='4' display={['none', 'flex']}>
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
                <InputRightElement onClick={handleGetTag} cursor='pointer'>
                  <SearchIcon />
                </InputRightElement>
              </InputGroup>
              <IconButton
                aria-label='switch-theme'
                icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
              />
            </HStack>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<HamburgerIcon />}
                variant='outline'
                display={[null, 'none']}
              />
              <MenuList>
                <MenuItem>
                  <InputGroup>
                    <Input
                      ref={mobileInputRef}
                      placeholder='Get by ID (comma separated)'
                      onClick={(event) => event.stopPropagation()}
                    />
                    <InputRightElement onClick={handleGetTagOnMobile}>
                      <SearchIcon />
                    </InputRightElement>
                  </InputGroup>
                </MenuItem>
                <MenuItem
                  icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                  onClick={toggleColorMode}>
                  Toggle Theme
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </nav>
    </>
  )
}

export default NavBar
