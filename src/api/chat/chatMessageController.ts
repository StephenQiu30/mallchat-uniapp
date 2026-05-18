import request from '@/services/request'

/** 获取历史消息 */
export async function listHistoryMessages(params: ChatAPI.listHistoryMessagesParams) {
  return request<ChatAPI.BaseResponseListChatMessageVO>('/chat/message/list/history/vo', {
    method: 'GET',
    params: {
      limit: '20',
      ...params,
    },
  })
}

/** 上报消息已读 */
export async function markMessageRead(body: ChatAPI.ChatMessageReadRequest) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/message/read', {
    method: 'POST',
    data: body,
  })
}

/** 撤回消息 */
export async function recallMessage(body: ChatAPI.DeleteRequest) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/message/recall', {
    method: 'POST',
    data: body,
  })
}

/** 发送消息 */
export async function sendMessage(body: ChatAPI.ChatMessageSendRequest) {
  return request<ChatAPI.BaseResponseChatMessageVO>('/chat/message/send', {
    method: 'POST',
    data: body,
  })
}
