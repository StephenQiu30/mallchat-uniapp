import request from '@/services/request'

/** 申请好友 */
export async function applyFriend(body: ChatAPI.ChatFriendApplyRequest) {
  return request<ChatAPI.BaseResponseLong>('/chat/friend/apply/add', {
    method: 'POST',
    data: body,
  })
}

/** 审核好友 */
export async function approveFriend(body: ChatAPI.ChatFriendApproveRequest) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/friend/apply/approve', {
    method: 'POST',
    data: body,
  })
}

/** 好友申请列表 */
export async function listFriendApply(body: ChatAPI.ChatFriendApplyQueryRequest) {
  return request<ChatAPI.BaseResponsePageChatFriendApplyVO>('/chat/friend/apply/list/page/vo', {
    method: 'POST',
    data: body,
  })
}
