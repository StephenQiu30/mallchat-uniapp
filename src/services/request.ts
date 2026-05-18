/**
 * 适配 UniApp 的请求封装
 * 支持 Token 鉴权、401 自动处理、BIGINT 字符串解析
 */

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080/api'

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, any>
  data?: any
  headers?: Record<string, string>
  [key: string]: any
}

/**
 * 基础请求封装
 */
export default async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', params, data, headers = {} } = options

  // 处理 Query 参数
  let queryString = ''
  if (params) {
    const parts = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    if (parts.length > 0) {
      queryString = (url.includes('?') ? '&' : '?') + parts.join('&')
    }
  }

  const fullUrl = url.startsWith('http') ? url + queryString : BASE_URL + url + queryString

  // 获取 Token
  const token = uni.getStorageSync('token')

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method: method as any,
      data: data,
      dataType: 'text',
      header: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...headers,
      },
      success: (res) => {
        let responseData: any
        try {
          responseData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        } catch (e) {
          responseData = res.data
        }

        // 处理未登录 (HTTP 401 或 业务 40100)
        if (res.statusCode === 401 || (responseData && responseData.code === 40100)) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('user_info')

          if (!url.includes('/user/login/')) {
            uni.showToast({ title: '登录已失效，请重新登录', icon: 'none' })
          }
          return reject(responseData)
        }

        // 处理业务异常
        if (responseData && responseData.code !== undefined && responseData.code !== 0) {
          uni.showToast({ title: responseData.message || '请求错误', icon: 'none' })
          return reject(responseData)
        }

        resolve(responseData as T)
      },
      fail: (err) => {
        uni.showToast({ title: '网络连接异常', icon: 'none' })
        reject(err)
      },
    })
  })
}

export { request }
