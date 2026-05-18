import request from '@/services/request'

/** 获取当前用户的通知列表 */
export async function listMyNotificationVoByPage(body: NotificationAPI.NotificationQueryRequest) {
  return request<NotificationAPI.BaseResponsePageNotificationVO>('/notification/my/list/page/vo', {
    method: 'POST',
    data: body,
  })
}

/** 标记已读 */
export async function markNotificationRead(body: NotificationAPI.NotificationReadRequest) {
  return request<NotificationAPI.BaseResponseBoolean>('/notification/read', {
    method: 'POST',
    data: body,
  })
}

/** 全量已读 */
export async function markAllNotificationRead() {
  return request<NotificationAPI.BaseResponseBoolean>('/notification/read/all', {
    method: 'POST',
  })
}

/** 获取未读通知数 */
export async function getNotificationUnreadCount() {
  return request<NotificationAPI.BaseResponseLong>('/notification/unread/count', {
    method: 'GET',
  })
}
