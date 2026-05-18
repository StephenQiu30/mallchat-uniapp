import request from '@/services/request'

/** 直接添加好友 */
export async function addFriend(body: ChatAPI.ChatFriendAddRequest) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/friend/add', {
    method: 'POST',
    data: body,
  })
}

/** 我的好友列表 */
export async function listFriends() {
  return request<ChatAPI.BaseResponseListChatFriendUserVO>('/chat/friend/list/vo', {
    method: 'GET',
  })
}
