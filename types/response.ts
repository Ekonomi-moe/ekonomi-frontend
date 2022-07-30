export interface EveryResponses {
  status: number
  message: string
  data?: any
}

export interface UploadImageResponse extends EveryResponses {
  data?: {
    ok: number
    ok_list: string[]
  }
}

export interface Tag {
  general: [string, number][]
  character: string
  rating: 'safe' | 'questionable' | 'explicit'
  img: string
  id: string
}

export interface GetImageTagResponse extends EveryResponses {
  data?: Tag
}
