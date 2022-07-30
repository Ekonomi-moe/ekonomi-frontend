import {
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import React from 'react'

const ErrorAlert = (props: { children: string }) => {
  return (
    <Container maxW='container.lg'>
      <Alert status='error'>
        <AlertIcon />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>{props.children}</AlertDescription>
      </Alert>
    </Container>
  )
}

export default ErrorAlert
