import { HStack, Spinner, Text } from '@chakra-ui/react'
import React from 'react'

const Loading = () => {
  return (
    <HStack spacing='4'>
      <Spinner />
      <Text>Loading...</Text>
    </HStack>
  )
}

export default Loading
