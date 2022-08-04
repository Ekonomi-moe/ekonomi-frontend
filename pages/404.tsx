import React from 'react'
import { Center, Text, Heading, VStack } from '@chakra-ui/react'

const _404 = () => (
  <Center h='100vh'>
    <VStack>
      <Heading fontSize='4xl'>404</Heading>
      <Text fontSize='lg'>You went to the wrong page...</Text>
    </VStack>
  </Center>
)

export default _404
