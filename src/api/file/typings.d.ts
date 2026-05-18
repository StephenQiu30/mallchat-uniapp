declare namespace FileAPI {
  type BaseResponseFileVO = {
    code?: number
    data?: FileVO
    message?: string
  }

  type FileVO = {
    url?: string
    key?: string
    fileName?: string
    size?: number
  }

  type uploadFileParams = {
    bizType: string
  }
}
