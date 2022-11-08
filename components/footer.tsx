import { Container, Center, Text, Stack } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const Footer = () => (
  <footer>
    <Container maxW='container.lg' p='4'>
      <Center>
        <Stack direction={{ base: 'column', md: 'row' }} alignItems='center'>
          <Text color='GrayText'>
            Made with ❤️ by{' '}
            <Link href='https://github.com/Ekonomi-moe'>
              <Text
                as='span'
                color='teal.500'
                cursor='pointer'
                _hover={{
                  color: 'teal.600',
                  transition: 'color 150ms ease-in-out'
                }}
                transition='color 150ms ease-in-out'>
                Ekonomi-moe
              </Text>
            </Link>
            .
          </Text>
          <Text color='GrayText'>
            Check out our{' '}
            <Link href='https://discord.gg/fPsRMgR3xy'>
              <Text
                as='span'
                color='teal.500'
                cursor='pointer'
                _hover={{
                  color: 'teal.600',
                  transition: 'color 150ms ease-in-out'
                }}
                transition='color 150ms ease-in-out'>
                Discord
              </Text>
            </Link>{' '}
            too!
          </Text>
        </Stack>
      </Center>
    </Container>
  </footer>
)

export default Footer
