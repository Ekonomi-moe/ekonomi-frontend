import type { Tag } from './response'

export interface TagStatus {
  error?: Error
  data?: Tag & {
    blur: boolean
  }
}

export interface TagsState {
  tags: TagStatus[]
  currentIndex: number
  isLoading: boolean
  showMore: boolean
}
