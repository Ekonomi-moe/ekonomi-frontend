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
import ErrorAlert from 'components/errorAlert'
const initialState: TagsState = {
  tags: [],
  currentIndex: 0,
  isLoading: true,
  showMore: false
}

const reducer = (
  state: TagsState,
  action: {
    type:
      | 'ADD_TAG_STATUS'
      | 'SET_LOADING'
      | 'SET_INDEX'
      | 'SET_BLUR'
      | 'RESET'
      | 'SHOW_MORE'
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
    case 'SHOW_MORE':
      return {
        ...state,
        showMore: true
      }
  }
}

const Tags = ({ isDev }: { isDev: boolean }) => {
  const router = useRouter()
  const [state, dispatch] = React.useReducer(reducer, initialState)
  React.useEffect(() => {
    if (!router.query.id) {
      router.push('/')
      return
    }
    const ids = (router.query.id as string | undefined)?.split(',')
    if (ids === undefined) {
      router.push('/')
      return
    }
    dispatch({ type: 'RESET' })
    const fetchRetry = FetchRetry(fetch)
    ids.forEach(async (id) => {
      const url = `${
        isDev ? 'https://devapi.ekonomi.moe' : 'https://api.ekonomi.moe'
      }/api/ddr?id=${id}`
      try {
        const resp = await fetchRetry(url, {
          retryOn: async (attempts, error, resp) => {
            if (attempts > 10 || resp.status === 404) {
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
          if (resp.status === 503) {
            dispatch({
              type: 'ADD_TAG_STATUS',
              tag: {
                error: 'The server is currently under maintenance or is down.'
              }
            })
          } else if (resp.status === 404) {
            dispatch({
              type: 'ADD_TAG_STATUS',
              tag: { error: 'Cannot find the matching image.' }
            })
          } else if (resp.status === 419) {
            dispatch({
              type: 'ADD_TAG_STATUS',
              tag: {
                error:
                  "You're sending too many requests. Please try again later."
              }
            })
          } else {
            dispatch({
              type: 'ADD_TAG_STATUS',
              tag: { error: data.message }
            })
          }
        }
      } catch (error) {
        dispatch({ type: 'ADD_TAG_STATUS', tag: { error } })
      }
    })
  }, [router.query.id])
  React.useEffect(() => {
    if (
      state.isLoading &&
      state.tags.length >=
        (router.query.id as string | undefined)?.split(',')?.length
    ) {
      const index = state.tags.findIndex((tag) => !tag.error)
      if (index !== -1) {
        dispatch({ type: 'SET_INDEX', index })
      }
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
                  label={tag.error ?? ''}
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
            {state.tags[state.currentIndex]!.error ? (
              <Box p='4'>
                <ErrorAlert>{state.tags[state.currentIndex]!.error}</ErrorAlert>
              </Box>
            ) : (
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
                      src={
                        state.tags[state.currentIndex].data?.image === undefined
                          ? `https://${isDev ? 'devimg' : 'img'}.ekonomi.moe/${
                              state.tags[state.currentIndex].data!.id
                            }.png`
                          : `data:image/png;base64,${
                              state.tags[state.currentIndex].data!.image
                            }`
                      }
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
                  <VStack
                    justifyContent='normal'
                    alignItems='normal'
                    maxW='50%'>
                    <Text>Tags:</Text>
                    <div>
                      {(state.showMore
                        ? state.tags[state.currentIndex].data!.general.filter(
                            (tag) => tag[1] > 0.5
                          )
                        : state.tags[state.currentIndex].data!.general.slice(
                            0,
                            10
                          )
                      ).map((tag) => (
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
                      {state.tags[state.currentIndex].data!.general.length >
                        10 &&
                        state.tags[state.currentIndex].data!.general.filter(
                          (tag) => tag[1] > 0.5
                        ).length > 10 &&
                        !state.showMore && (
                          <Button
                            size='xs'
                            onClick={() => dispatch({ type: 'SHOW_MORE' })}
                            m='1'>
                            Show more...
                          </Button>
                        )}
                    </div>
                    <Divider />
                    <Text>Character:</Text>
                    <div>
                      {state.tags[state.currentIndex].data!.character.length ===
                      0
                        ? 'Not sure...'
                        : state.tags[state.currentIndex].data!.character.map(
                            (character) => (
                              <Tooltip
                                label={`${(character[1] * 100).toFixed(1)}%`}
                                aria-label='confidence'
                                key={character[0]}
                                hasArrow>
                                <Tag
                                  colorScheme='teal'
                                  key={character[0]}
                                  m='1'
                                  _hover={{
                                    bg:
                                      colorMode === 'light'
                                        ? 'teal.50'
                                        : 'teal.700',
                                    transition: 'color 0.5s ease-in-out'
                                  }}
                                  transition='color 0.5s ease-in-out'>
                                  {character[0]}
                                </Tag>
                              </Tooltip>
                            )
                          )}
                    </div>
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
                {state.tags.filter((tag) => !tag.error).length > 1 && (
                  <Box maxW='lg' p='4' pt={[0, 4]}>
                    <Text p='1'>Overall Tags:</Text>
                    <Box>
                      {(() => {
                        const tags = state.tags
                          .filter((tag) => !tag.error)
                          .map((tag) => tag.data!.general)
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
            )}
          </Container>
        </Center>
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

export default Tags
