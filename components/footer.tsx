import { Container, Center, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const Footer = () => (
  <footer>
    <Container maxW='container.lg'>
      <Center>
        <Text color='GrayText'>
          Made with ❤️ by{' '}
          <Link href='https://github.com/EKonomi-moe'>
            <Text
              as='span'
              color='teal.500'
              cursor='pointer'
              _hover={{
                color: 'teal.600',
                transition: 'color 150ms ease-in-out'
              }}
              transition='color 150ms ease-in-out'>
              EKonomi-moe
            </Text>
          </Link>
        </Text>
      </Center>
    </Container>
  </footer>
)

export default Footer
