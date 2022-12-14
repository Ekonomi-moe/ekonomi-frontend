import {
  Heading,
  Text,
  Button,
  VStack,
  Center,
  Box,
  Container
} from '@chakra-ui/react'
import React from 'react'
import NavBar from 'components/navbar'
import { UploadImageResponse } from 'types/response'
import { useRouter } from 'next/router'
import Loading from 'components/loading'
import ErrorAlert from 'components/errorAlert'
import Footer from 'components/footer'

const Index = ({ isDev }: { isDev: boolean }) => {
  const inputRef = React.useRef(null)
  const router = useRouter()
  const [dragActived, setDragActive] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const submitFile = async (files: FileList) => {
    if (files.length > 5) {
      setError('You can only upload up to 5 files at once.')
      return
    }
    setLoading(true)
    const formdata = new FormData()
    Array.from(files).forEach((file) => {
      formdata.append('file', file)
    })
    try {
      const resp = await fetch(
        `${
          isDev ? 'https://devapi.ekonomi.moe' : 'https://api.ekonomi.moe'
        }/api/ddr_bulk`,
        {
          body: formdata,
          method: 'POST'
        }
      )
      if (!resp.ok) {
        if (resp.status === 503) {
          setError('The server is currently under maintenance or is down.')
        } else if (resp.status === 413) {
          setError('The file size is too large.')
        } else if (resp.status === 419) {
          setError("You're sending too many requests. Please try again later.")
        }
        throw new Error(
          `Unknown error, but here's the http status code: ${resp.status}`
        )
      }
      const json: UploadImageResponse = await resp.json()
      if (json.status !== 200) {
        setError(json.message)
      } else {
        router.push(`/tags?id=${json.data.ok_list.join(',')}`)
      }
      setLoading(false)
    } catch (error) {
      setError(error.toString())
      setLoading(false)
    }
  }

  const onClickSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files) {
      submitFile(event.target.files)
    }
  }

  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    if (loading) return
    event.preventDefault()
    event.stopPropagation()
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    if (event.dataTransfer.files) {
      submitFile(event.dataTransfer.files)
    }
  }

  return (
    <>
      <NavBar />
      <main onDragEnter={onDrag}>
        {loading ? (
          <Center>
            <Loading />
          </Center>
        ) : (
          <Container maxW='container.lg'>
            {error ? (
              <ErrorAlert>
                {error.toString() ?? 'Unknown error. Please try again later.'}
              </ErrorAlert>
            ) : null}
            <Center>
              <Heading size='xl' pb='4'>
                Upload your image, get your tags.
              </Heading>
            </Center>
            <VStack
              borderWidth='1px'
              borderRadius='lg'
              padding='4'
              width='full'>
              <input
                ref={inputRef}
                type='file'
                onChange={onClickSubmit}
                style={{ display: 'none' }}
                accept='image/*'
                multiple
              />
              <Text fontSize='xl'>
                {dragActived ? 'Drop!' : 'Drag and Drop'}
              </Text>
              <Text fontSize='xl'>{dragActived ? '\u00a0' : 'or'}</Text>
              <Button
                onClick={() => inputRef.current.click()}
                disabled={dragActived}>
                Upload
              </Button>
              <Text fontSize='sm' color='GrayText'>
                Maximum 5 files at once.
              </Text>
              {dragActived && (
                <div
                  onDragEnter={onDrag}
                  onDragLeave={onDrag}
                  onDragOver={onDrag}
                  onDrop={onDrop}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0
                  }}
                />
              )}
            </VStack>
          </Container>
        )}
      </main>
      <Footer />
    </>
  )
}

export const getStaticProps = async () => {
  return {
    props: {
      isDev:
        process.env.NODE_ENV === 'development' ||
        process.env.DEVELOPMENT_MODE === '1'
    }
  }
}

export default Index
