const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'user_info'

export const setToken = (token: string) => {
  uni.setStorageSync(TOKEN_KEY, token)
}

export const getToken = (): string => {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export const removeToken = () => {
  uni.removeStorageSync(TOKEN_KEY)
}

export const setUserInfo = (userInfo: any) => {
  uni.setStorageSync(USER_INFO_KEY, userInfo)
}

export const getUserInfo = () => {
  return uni.getStorageSync(USER_INFO_KEY)
}

export const removeUserInfo = () => {
  uni.removeStorageSync(USER_INFO_KEY)
}
