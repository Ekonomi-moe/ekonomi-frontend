import React from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import {
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  Image,
  Text,
  Tooltip,
  VStack,
  Tag,
  Checkbox,
  Button,
  useColorMode
} from '@chakra-ui/react'
import NavBar from 'components/navbar'
import { GetImageTagResponse } from 'types/response'
import Loading from 'components/loading'
import ErrorAlert from 'components/errorAlert'
import Link from 'next/link'

const fetcher = async (url) => {
  const res = await fetch(url)

  if (res.status === 202) {
    const error = new Error('LOADING')
    throw error
  }
  if (!res.ok) {
    const error = new Error(
      ((await res.json()) as GetImageTagResponse).message ??
        'Unknown error. Please try again later.'
    )
    throw error
  }

  return res.json()
}

const Tags = () => {
  const router = useRouter()
  const { data, error } = useSWR(
    `https://deepapi.ontdb.com/api/ddr?id=${router.query.id}`,
    fetcher
  )
  const [blur, setBlur] = React.useState(false)
  const { colorMode } = useColorMode()
  React.useEffect(() => {
    if (data?.data?.rating === 'explicit' && !blur) {
      setBlur(true)
    }
  }, [data])
  if (error && error.message !== 'LOADING') {
    return (
      <>
        <NavBar />
        <main>
          <Center>
            <ErrorAlert>
              {error.toString() ??
                data?.message ??
                'Unknown error. Please try again later.'}
            </ErrorAlert>
          </Center>
        </main>
      </>
    )
  }

  if (!data || error?.message === 'LOADING') {
    return (
      <>
        <NavBar />
        <main>
          <Center>
            <Loading />
          </Center>
        </main>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <main>
        <Center>
          <Container maxW='container.lg'>
            <Heading size='xl'>Found your tags!</Heading>
            <HStack spacing='4' alignItems='normal' p='4'>
              <VStack>
                <Image
                  fit='contain'
                  width='lg'
                  src={`data:image/png;base64,${data.data.image}`}
                  filter={blur ? 'blur(0.75rem)' : 'inherit'}
                />
                <Checkbox
                  isChecked={blur}
                  onChange={(e) => setBlur(e.target.checked)}>
                  Blur Image
                </Checkbox>
              </VStack>
              <VStack justifyContent='normal' alignItems='normal'>
                <Text>Tags:</Text>
                <div>
                  {data.data.general.slice(0, 10).map((tag) => (
                    <Tooltip
                      label={`${tag[1].toFixed(3) * 100}%`}
                      aria-label='confidence'
                      key={tag[0]}
                      hasArrow>
                      <a
                        href={`https://danbooru.donmai.us/posts?tags=${tag[0]}`}
                        key={tag[0]}>
                        <Tag
                          colorScheme='teal'
                          key={tag[0]}
                          m='1'
                          cursor='pointer'
                          _hover={{
                            bg: colorMode === 'light' ? 'teal.50' : 'teal.700',
                            transition: 'color 0.5s ease-in-out'
                          }}
                          transition='color 0.5s ease-in-out'>
                          {tag[0]}
                        </Tag>
                      </a>
                    </Tooltip>
                  ))}
                </div>
                <Divider />
                <Text>Character: {data.data.character}</Text>
                <Divider />
                <Text>Rating: {data.data.rating}</Text>
                <Divider />
                <Center>
                  <Link href='/'>
                    <Button>Go back to Home</Button>
                  </Link>
                </Center>
              </VStack>
            </HStack>
          </Container>
        </Center>
      </main>
    </>
  )
}

export default Tags
