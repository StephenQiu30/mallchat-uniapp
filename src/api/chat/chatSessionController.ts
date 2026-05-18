import request from '@/services/request'

/** 删除会话 */
export async function deleteSession(body: ChatAPI.DeleteRequest) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/session/delete', {
    method: 'POST',
    data: body,
  })
}

/** 用户消息列表 */
export async function listMySessions() {
  return request<ChatAPI.BaseResponseListChatSessionVO>('/chat/session/list/vo', {
    method: 'GET',
  })
}

/** 置顶会话 */
export async function topSession(params: ChatAPI.topSessionParams) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/session/top', {
    method: 'POST',
    params,
  })
}
