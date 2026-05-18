import request from '@/services/request'

/** 创建群聊 */
export async function addChatRoom(body: ChatAPI.ChatRoomAddRequest) {
  return request<ChatAPI.BaseResponseLong>('/chat/room/add', {
    method: 'POST',
    data: body,
  })
}

/** 获取房间详情 */
export async function getRoomDetail(params: ChatAPI.getRoomDetailParams) {
  return request<ChatAPI.BaseResponseChatRoomVO>('/chat/room/detail', {
    method: 'GET',
    params,
  })
}

/** 解散群聊 */
export async function dismissRoom(params: ChatAPI.dismissRoomParams) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/room/dismiss', {
    method: 'POST',
    params,
  })
}

/** 邀请成员入群 */
export async function inviteMembers(body: ChatAPI.ChatRoomInviteRequest) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/room/invite', {
    method: 'POST',
    data: body,
  })
}

/** 加入聊天室 */
export async function joinChatRoom(params: ChatAPI.joinChatRoomParams) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/room/join', {
    method: 'POST',
    params,
  })
}

/** 获取当前用户的聊天室列表 */
export async function listUserChatRooms() {
  return request<ChatAPI.BaseResponseListChatRoomVO>('/chat/room/list/vo', {
    method: 'GET',
  })
}

/** 获取房间成员 */
export async function listRoomMembers(params: ChatAPI.listRoomMembersParams) {
  return request<ChatAPI.BaseResponseListChatRoomMemberVO>('/chat/room/member/list', {
    method: 'GET',
    params,
  })
}

/** 获取或创建私聊房间 */
export async function getOrCreatePrivateRoom(body: ChatAPI.ChatPrivateRoomRequest) {
  return request<ChatAPI.BaseResponseLong>('/chat/room/private', {
    method: 'POST',
    data: body,
  })
}

/** 退出群聊 */
export async function quitRoom(params: ChatAPI.quitRoomParams) {
  return request<ChatAPI.BaseResponseBoolean>('/chat/room/quit', {
    method: 'POST',
    params,
  })
}
