declare namespace ChatAPI {
  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseChatMessageVO = {
    code?: number
    data?: ChatMessageVO
    message?: string
  }

  type BaseResponseChatRoomVO = {
    code?: number
    data?: ChatRoomVO
    message?: string
  }

  type BaseResponseListChatFriendUserVO = {
    code?: number
    data?: ChatFriendUserVO[]
    message?: string
  }

  type BaseResponseListChatMessageVO = {
    code?: number
    data?: ChatMessageVO[]
    message?: string
  }

  type BaseResponseListChatRoomMemberVO = {
    code?: number
    data?: ChatRoomMemberVO[]
    message?: string
  }

  type BaseResponseListChatRoomVO = {
    code?: number
    data?: ChatRoomVO[]
    message?: string
  }

  type BaseResponseListChatSessionVO = {
    code?: number
    data?: ChatSessionVO[]
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageChatFriendApplyVO = {
    code?: number
    data?: PageChatFriendApplyVO
    message?: string
  }

  type ChatFriendAddRequest = {
    friendUserId: number
  }

  type ChatFriendApplyQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type ChatFriendApplyRequest = {
    targetId: number
    msg: string
  }

  type ChatFriendApplyVO = {
    id?: number
    userId?: number
    userName?: string
    userAvatar?: string
    msg?: string
    status?: number
    createTime?: string
  }

  type ChatFriendApproveRequest = {
    applyId: number
    status: number
  }

  type ChatFriendUserVO = {
    id?: number
    userName?: string
    userAvatar?: string
    onlineStatus?: number
  }

  type ChatMessageReadRequest = {
    roomId: number
    lastReadMessageId: number
  }

  type ChatMessageSendRequest = {
    roomId: number
    clientMsgId: string
    content?: string
    type: number
    extra?: string
    replyMsgId?: number
  }

  type ChatMessageVO = {
    id?: number
    roomId?: number
    fromUserId?: number
    clientMsgId?: string
    fromUserName?: string
    fromUserAvatar?: string
    content?: string
    type?: number
    extra?: string
    replyMsg?: ReplyMsgVO
    status?: number
    createTime?: string
  }

  type ChatPrivateRoomRequest = {
    peerUserId: number
  }

  type ChatRoomAddRequest = {
    name: string
    avatar?: string
    announcement?: string
    memberIds?: number[]
  }

  type ChatRoomInviteRequest = {
    roomId: number
    memberIds: number[]
  }

  type ChatRoomMemberVO = {
    id?: number
    roomId?: number
    userId?: number
    userName?: string
    userAvatar?: string
    role?: number
    lastReadMessageId?: number
    createTime?: string
  }

  type ChatRoomVO = {
    id?: number
    name?: string
    type?: number
    avatar?: string
    ownerUserId?: number
    memberCount?: number
    announcement?: string
    createTime?: string
  }

  type ChatSessionVO = {
    roomId?: number
    name?: string
    avatar?: string
    type?: number
    lastMessage?: string
    unreadCount?: number
    topStatus?: number
    activeTime?: string
    onlineStatus?: number
  }

  type DeleteRequest = {
    id: number
  }

  type dismissRoomParams = {
    roomId: number
  }

  type getRoomDetailParams = {
    roomId: number
  }

  type joinChatRoomParams = {
    roomId: number
  }

  type listHistoryMessagesParams = {
    roomId: number
    lastMessageId?: number
    limit?: number
  }

  type listRoomMembersParams = {
    roomId: number
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageChatFriendApplyVO = {
    records?: ChatFriendApplyVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    pages?: number
  }

  type quitRoomParams = {
    roomId: number
  }

  type ReplyMsgVO = {
    id?: number
    userName?: string
    content?: string
    type?: number
  }

  type topSessionParams = {
    roomId: number
    status: number
  }
}
