declare namespace NotificationAPI {
  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageNotificationVO = {
    code?: number
    data?: PageNotificationVO
    message?: string
  }

  type NotificationQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    type?: string
    userId?: number
    isRead?: number
    status?: number
    relatedType?: string
    searchText?: string
  }

  type NotificationReadRequest = {
    id?: number
  }

  type NotificationVO = {
    id?: number
    title?: string
    content?: string
    type?: string
    userId?: number
    userVO?: UserVO
    relatedId?: number
    relatedType?: string
    isRead?: number
    status?: number
    contentUrl?: string
    bizId?: string
    createTime?: string
    updateTime?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageNotificationVO = {
    records?: NotificationVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    pages?: number
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
