import React from 'react'
import { useRouter } from 'next/router'
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
  useColorMode,
  Stack,
  Box
} from '@chakra-ui/react'
import NavBar from 'components/navbar'
import { GetImageTagResponse } from 'types/response'
import Loading from 'components/loading'
import Link from 'next/link'
import { TagsState, TagStatus } from 'types/tagsState'
import FetchRetry from 'fetch-retry'
import Footer from 'components/footer'
const initialState: TagsState = {
  tags: [],
  currentIndex: 0,
  isLoading: true
}

const reducer = (
  state: TagsState,
  action: {
    type: 'ADD_TAG_STATUS' | 'SET_LOADING' | 'SET_INDEX' | 'SET_BLUR' | 'RESET'
    tag?: TagStatus
    index?: number
    blur?: boolean
    loading?: boolean
  }
) => {
  switch (action.type) {
    case 'ADD_TAG_STATUS':
      if (action.tag) {
        return {
          ...state,
          tags: [...state.tags, action.tag]
        }
      }
      return state
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.loading
      }
    case 'SET_INDEX':
      if (action.index !== undefined) {
        return {
          ...state,
          currentIndex: action.index
        }
      }
      return state
    case 'SET_BLUR':
      if (state.tags[state.currentIndex].data) {
        const tags = [...state.tags]
        tags[state.currentIndex].data.blur = action.blur ?? false
        return {
          ...state,
          tags
        }
      }
      return state
    case 'RESET':
      return initialState
  }
}

const Tags = () => {
  const router = useRouter()
  const [state, dispatch] = React.useReducer(reducer, initialState)
  React.useEffect(() => {
    if (!router.query.id) {
      router.push('/')
    }
    dispatch({ type: 'RESET' })
    const ids = (router.query.id as string).split(',')
    const fetchRetry = FetchRetry(fetch)
    ids.forEach(async (id) => {
      const url = `https://devapi.ekonomi.moe/api/ddr?id=${id}`
      try {
        const resp = await fetchRetry(url, {
          retryOn: async (attempts, error, resp) => {
            if (attempts > 10) {
              return false
            }

            if (error !== null || !resp.ok || resp.status === 202) {
              return true
            }
          },
          retryDelay: 1000
        })
        const data: GetImageTagResponse = await resp.json()
        if (data.data) {
          const result: TagStatus = {
            data: {
              ...data.data,
              blur: data.data.rating === 'explicit'
            }
          }
          dispatch({ type: 'ADD_TAG_STATUS', tag: result })
        } else {
          dispatch({
            type: 'ADD_TAG_STATUS',
            tag: { error: new Error(data.message) }
          })
        }
      } catch (error) {
        dispatch({ type: 'ADD_TAG_STATUS', tag: { error: error.message } })
      }
    })
  }, [router.query.id])
  React.useEffect(() => {
    if (state.tags.length >= (router.query.id as string).split(',').length) {
      dispatch({ type: 'SET_LOADING', loading: false })
    }
  }, [state.tags])
  const { colorMode } = useColorMode()

  if (state.isLoading) {
    return (
      <>
        <NavBar />
        <main>
          <Center>
            <Loading />
          </Center>
        </main>
        <Footer />
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
            <HStack spacing='4' p='4' pb='1'>
              {state.tags.map((tag, index) => (
                <Tooltip
                  key={index}
                  label={tag.error?.message ?? ''}
                  isDisabled={tag.error === undefined}
                  shouldWrapChildren>
                  <Button
                    key={index}
                    colorScheme={tag.error ? 'red' : 'teal'}
                    isDisabled={
                      tag.error !== undefined || state.currentIndex === index
                    }
                    onClick={() => dispatch({ type: 'SET_INDEX', index })}>
                    {index + 1}
                  </Button>
                </Tooltip>
              ))}
            </HStack>
            <VStack>
              <Stack
                spacing='4'
                alignItems='normal'
                p='4'
                direction={['column', 'row']}>
                <VStack>
                  <Image
                    fit='contain'
                    width='lg'
                    src={`data:image/png;base64,${
                      state.tags[state.currentIndex].data!.image
                    }`}
                    filter={
                      state.tags[state.currentIndex].data!.blur
                        ? 'blur(0.75rem)'
                        : 'inherit'
                    }
                  />
                  <Checkbox
                    isChecked={state.tags[state.currentIndex].data!.blur}
                    onChange={(e) =>
                      dispatch({ type: 'SET_BLUR', blur: e.target.checked })
                    }>
                    Blur Image
                  </Checkbox>
                </VStack>
                <VStack justifyContent='normal' alignItems='normal'>
                  <Text>Tags:</Text>
                  <div>
                    {state.tags[state.currentIndex]
                      .data!.general.slice(0, 10)
                      .map((tag) => (
                        <Tooltip
                          label={`${(tag[1] * 100).toFixed(1)}%`}
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
                                bg:
                                  colorMode === 'light'
                                    ? 'teal.50'
                                    : 'teal.700',
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
                  <Text>
                    Character: {state.tags[state.currentIndex].data!.character}
                  </Text>
                  <Divider />
                  <Text>
                    Rating: {state.tags[state.currentIndex].data!.rating}
                  </Text>
                  <Divider />
                  <Center display={['none', 'flex']}>
                    <Link href='/'>
                      <Button>Go back to Home</Button>
                    </Link>
                  </Center>
                </VStack>
              </Stack>
              {state.tags.length > 1 && (
                <Box maxW='lg' p='4' pt={[0, 4]}>
                  <Text p='1'>Overall Tags:</Text>
                  <Box>
                    {(() => {
                      const tags = state.tags.map((tag) => tag.data!.general)
                      const flatTags = tags.reduce(
                        (prev, curr) => prev.concat(curr),
                        []
                      )
                      const tagCounts: { [key: string]: number } =
                        flatTags.reduce((prev, curr) => {
                          if (prev[curr[0]] === undefined) {
                            prev[curr[0]] = curr[1] / tags.length
                          } else {
                            prev[curr[0]] += curr[1] / tags.length
                          }
                          return prev
                        }, {})
                      return Object.entries(tagCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 10)
                        .map((tag) => (
                          <Tooltip
                            label={`${(tag[1] * 100).toFixed(1)}%`}
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
                                  bg:
                                    colorMode === 'light'
                                      ? 'teal.50'
                                      : 'teal.700',
                                  transition: 'color 0.5s ease-in-out'
                                }}
                                transition='color 0.5s ease-in-out'>
                                {tag[0]}
                              </Tag>
                            </a>
                          </Tooltip>
                        ))
                    })()}
                  </Box>
                </Box>
              )}
              <Center display={['flex', 'none']}>
                <Link href='/'>
                  <Button>Go back to Home</Button>
                </Link>
              </Center>
            </VStack>
          </Container>
        </Center>
      </main>
      <Footer />
    </>
  )
}

export default Tags
