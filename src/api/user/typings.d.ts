declare namespace UserAPI {
  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseListUserVO = {
    code?: number
    data?: UserVO[]
    message?: string
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageUserVO = {
    code?: number
    data?: PageUserVO
    message?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
  }

  type DeleteRequest = {
    id: number
  }

  type getUserByIdParams = {
    id: number
  }

  type getUserVOByIdParams = {
    id: number
  }

  type getUserVOByIdsParams = {
    ids: number[]
  }

  type LoginUserVO = {
    id?: number
    userName?: string
    userAvatar?: string
    userRole?: string
    userProfile?: string
    userPhone?: string
    userEmail?: string
    lastLoginTime?: string
    createTime?: string
    updateTime?: string
    token?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageUserVO = {
    records?: UserVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    pages?: number
  }

  type UserAddRequest = {
    userName?: string
    userAvatar?: string
    userRole?: string
    userEmail?: string
  }

  type UserEditRequest = {
    userName?: string
    userAvatar?: string
    userProfile?: string
    userPhone?: string
    userEmail?: string
  }

  type UserMaLoginRequest = {
    code?: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    notId?: number
    wxUnionId?: string
    userName?: string
    userRole?: string
    userPhone?: string
    searchText?: string
  }

  type UserUpdateRequest = {
    id?: number
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    userPhone?: string
    userEmail?: string
  }

  type UserVO = {
    id?: number
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    userPhone?: string
    userEmail?: string
    createTime?: string
    updateTime?: string
  }
}
