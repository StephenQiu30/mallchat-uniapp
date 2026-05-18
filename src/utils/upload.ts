import { getToken } from './auth'

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080/api'

export interface FileVO {
  url?: string
  key?: string
  fileName?: string
  size?: number
}

/**
 * 上传文件到服务器
 * @param bizType 业务类型
 * @param filePath 本地文件路径
 */
export async function uploadFileByBizType(
  bizType: 'user_avatar' | 'chat_image' | 'chat_file',
  filePath: string
): Promise<FileVO> {
  const token = getToken()

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}/file/upload?bizType=${bizType}`,
      filePath,
      name: 'file',
      header: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      success: (res) => {
        try {
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          if (data.code !== 0 || !data.data) {
            reject(new Error(data.message || '上传失败'))
            return
          }
          resolve(data.data)
        } catch (e) {
          reject(new Error('解析上传结果失败'))
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
