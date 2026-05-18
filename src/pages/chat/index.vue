<template>
  <view class="chat-page">
    <!-- 消息列表 -->
    <scroll-view
      class="message-scroll"
      scroll-y
      :scroll-into-view="scrollId"
      enhanced
      :show-scrollbar="false"
      scroll-with-animation
      @scrolltoupper="loadMoreMessages"
    >
      <!-- 加载更多提示 -->
      <view v-if="hasMore" class="load-more">
        <t-loading size="32rpx" />
        <text class="load-more-text">加载更多...</text>
      </view>

      <view class="msg-list">
        <view
          v-for="msg in messages"
          :key="msg.id"
          :id="'msg-' + msg.id"
          class="msg-item"
          :class="msg.fromUserId === myUserId ? 'msg-self' : 'msg-peer'"
          @longpress="onMessageLongPress(msg)"
        >
          <t-avatar
            :image="msg.fromUserAvatar"
            size="80rpx"
            class="msg-avatar"
          />
          <view class="msg-content">
            <text v-if="msg.fromUserId !== myUserId" class="sender-name">
              {{ msg.fromUserName }}
            </text>
            <!-- 文本消息 -->
            <view
              v-if="msg.type === 1"
              class="chat-bubble"
              :class="msg.fromUserId === myUserId ? 'chat-bubble-self' : 'chat-bubble-peer'"
            >
              {{ msg.content }}
            </view>
            <!-- 图片消息 -->
            <view
              v-else-if="msg.type === 2"
              class="image-bubble"
              @click="previewImage(msg)"
            >
              <image
                :src="getImageUrl(msg)"
                mode="widthFix"
                class="chat-image"
                :style="{ maxWidth: '400rpx' }"
              />
            </view>
            <!-- 其他消息类型 -->
            <view
              v-else
              class="chat-bubble"
              :class="msg.fromUserId === myUserId ? 'chat-bubble-self' : 'chat-bubble-peer'"
            >
              <text class="unsupported-msg">[不支持的消息类型]</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入栏 -->
    <view class="chat-footer">
      <t-icon
        name="image"
        size="56rpx"
        color="#666"
        class="footer-icon"
        @click="chooseImage"
      />
      <t-input
        v-model="inputMsg"
        placeholder="发送消息..."
        :border="false"
        class="message-input"
        confirm-type="send"
        @confirm="sendTextMessage"
      />
      <view
        class="send-btn"
        :class="{ 'send-btn-active': inputMsg.trim() }"
        @click="sendTextMessage"
      >
        <text class="send-btn-text">发送</text>
      </view>
    </view>

    <!-- 消息操作菜单 -->
    <t-action-sheet
      v-model:visible="showMsgActions"
      :actions="msgActions"
      @selected="onMsgActionSelected"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import chatApi from '@/api/chat'
import { getUserInfo } from '@/utils/auth'
import { uploadFileByBizType } from '@/utils/upload'
import { wsManager, WsMessageType } from '@/services/websocket'

// 消息类型常量
const MSG_TYPE_TEXT = 1
const MSG_TYPE_IMAGE = 2
const MSG_TYPE_RECALLED = -1

const roomId = ref(0)
const roomName = ref('')
const myUserId = ref(0)
const messages = ref<ChatAPI.ChatMessageVO[]>([])
const inputMsg = ref('')
const scrollId = ref('')
const hasMore = ref(true)
const loadingMore = ref(false)
const showMsgActions = ref(false)
const selectedMsg = ref<ChatAPI.ChatMessageVO | null>(null)

const msgActions = ref<Array<{ label: string; value: string; theme?: string }>>([])

/** 生成客户端消息 ID */
function genClientMsgId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** 从消息 extra 字段提取图片 URL */
function getImageUrl(msg: ChatAPI.ChatMessageVO): string {
  try {
    if (msg.extra) {
      const extra = JSON.parse(msg.extra)
      return extra.url || ''
    }
  } catch {}
  return msg.content || ''
}

/** 加载历史消息 */
async function loadMessages(lastMessageId?: number) {
  if (loadingMore.value) return
  loadingMore.value = true

  try {
    const res = await chatApi.chatMessageController.listHistoryMessages({
      roomId: roomId.value,
      lastMessageId,
      limit: 20,
    })

    if (res.data) {
      const newMessages = res.data.reverse()
      if (lastMessageId) {
        // 加载更多：追加到前面
        messages.value = [...newMessages, ...messages.value]
      } else {
        // 初始加载
        messages.value = newMessages
      }
      hasMore.value = res.data.length >= 20

      // 滚动到底部
      if (!lastMessageId && newMessages.length > 0) {
        await nextTick()
        scrollToBottom()
      }
    }
  } catch (e) {
    console.error('加载消息失败', e)
  } finally {
    loadingMore.value = false
  }
}

/** 加载更多历史消息 */
async function loadMoreMessages() {
  if (!hasMore.value || messages.value.length === 0) return
  const firstMsg = messages.value[0]
  if (firstMsg?.id) {
    await loadMessages(firstMsg.id)
  }
}

/** 滚动到底部 */
function scrollToBottom() {
  if (messages.value.length > 0) {
    const lastMsg = messages.value[messages.value.length - 1]
    scrollId.value = 'msg-' + lastMsg.id
  }
}

/** 发送文本消息 */
async function sendTextMessage() {
  const content = inputMsg.value.trim()
  if (!content) return

  const clientMsgId = genClientMsgId()

  try {
    const res = await chatApi.chatMessageController.sendMessage({
      roomId: roomId.value,
      clientMsgId,
      content,
      type: MSG_TYPE_TEXT,
    })

    if (res.data) {
      messages.value.push(res.data)
      inputMsg.value = ''
      await nextTick()
      scrollToBottom()
    }
  } catch (e) {
    console.error('发送消息失败', e)
    uni.showToast({ title: '发送失败', icon: 'none' })
  }
}

/** 选择图片并发送 */
function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const filePath = res.tempFilePaths[0]
      if (!filePath) return

      uni.showLoading({ title: '发送中...' })

      try {
        const fileResult = await uploadFileByBizType('chat_image', filePath)
        const clientMsgId = genClientMsgId()

        const msgRes = await chatApi.chatMessageController.sendMessage({
          roomId: roomId.value,
          clientMsgId,
          content: '',
          type: MSG_TYPE_IMAGE,
          extra: JSON.stringify({ url: fileResult.url }),
        })

        if (msgRes.data) {
          messages.value.push(msgRes.data)
          await nextTick()
          scrollToBottom()
        }
      } catch (e) {
        console.error('发送图片失败', e)
        uni.showToast({ title: '发送失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
  })
}

/** 预览图片 */
function previewImage(msg: ChatAPI.ChatMessageVO) {
  const url = getImageUrl(msg)
  if (url) {
    uni.previewImage({
      urls: [url],
      current: url,
    })
  }
}

/** 消息长按操作 */
function onMessageLongPress(msg: ChatAPI.ChatMessageVO) {
  selectedMsg.value = msg
  const isSelf = msg.fromUserId === myUserId.value
  const actions: Array<{ label: string; value: string; theme?: string }> = []

  if (isSelf && msg.type !== MSG_TYPE_RECALLED) {
    actions.push({ label: '撤回', value: 'recall', theme: 'danger' })
  }

  if (actions.length === 0) return

  msgActions.value = actions
  showMsgActions.value = true
}

/** 消息操作选择 */
async function onMsgActionSelected(action: { value: string }) {
  if (!selectedMsg.value) return

  if (action.value === 'recall') {
    try {
      await chatApi.chatMessageController.recallMessage({ id: selectedMsg.value.id! })
      // 标记消息为已撤回
      const idx = messages.value.findIndex((m) => m.id === selectedMsg.value!.id)
      if (idx !== -1) {
        messages.value[idx].type = MSG_TYPE_RECALLED
        messages.value[idx].content = '你撤回了一条消息'
      }
      uni.showToast({ title: '已撤回', icon: 'none' })
    } catch (e) {
      console.error('撤回消息失败', e)
    }
  }

  showMsgActions.value = false
  selectedMsg.value = null
}

/** 监听 WebSocket 消息 */
function handleWsMessage(msg: any) {
  if (msg.data && msg.data.roomId === roomId.value) {
    messages.value.push(msg.data)
    nextTick(() => scrollToBottom())
  }
}

/** 上报消息已读 */
async function markRead() {
  if (messages.value.length === 0) return
  const lastMsg = messages.value[messages.value.length - 1]
  if (lastMsg?.id) {
    try {
      await chatApi.chatMessageController.markMessageRead({
        roomId: roomId.value,
        lastReadMessageId: lastMsg.id,
      })
    } catch {}
  }
}

onLoad((options) => {
  if (options?.roomId) {
    roomId.value = Number(options.roomId)
  }
  if (options?.name) {
    roomName.value = decodeURIComponent(options.name)
    uni.setNavigationBarTitle({ title: roomName.value })
  }

  // 获取当前用户 ID
  const userInfo = getUserInfo()
  if (userInfo?.id) {
    myUserId.value = userInfo.id
  }

  loadMessages()

  // 注册 WebSocket 监听
  wsManager.on(WsMessageType.MESSAGE, handleWsMessage)
})

onUnload(() => {
  // 移除 WebSocket 监听
  wsManager.off(WsMessageType.MESSAGE, handleWsMessage)
  // 上报已读
  markRead()
})
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.message-scroll {
  flex: 1;
  overflow: hidden;
}

.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  gap: 12rpx;
}

.load-more-text {
  font-size: 24rpx;
  color: #999;
}

.msg-list {
  padding: 32rpx;
}

.msg-item {
  display: flex;
  margin-bottom: 40rpx;
  max-width: 85%;
}

.msg-peer {
  flex-direction: row;
}

.msg-self {
  flex-direction: row-reverse;
  align-self: flex-end;
  margin-left: auto;
}

.msg-avatar {
  flex-shrink: 0;
}

.msg-content {
  margin: 0 20rpx;
}

.sender-name {
  display: block;
  font-size: 24rpx;
  color: var(--app-text-secondary);
  margin-bottom: 8rpx;
  margin-left: 8rpx;
}

.chat-bubble {
  padding: 24rpx;
  font-size: 30rpx;
  line-height: 1.5;
  border-radius: 20rpx;
  max-width: 100%;
  word-break: break-all;
}

.chat-bubble-peer {
  background-color: #fff;
  border-top-left-radius: 4rpx;
  color: var(--app-text-primary);
}

.chat-bubble-self {
  background-color: var(--td-brand-color, #0052D9);
  border-top-right-radius: 4rpx;
  color: #fff;
}

.image-bubble {
  border-radius: 12rpx;
  overflow: hidden;
}

.chat-image {
  display: block;
  border-radius: 12rpx;
  max-width: 400rpx;
  min-width: 200rpx;
  min-height: 100rpx;
  background-color: #e0e0e0;
}

.unsupported-msg {
  color: #999;
  font-style: italic;
}

.chat-footer {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  gap: 20rpx;
}

.footer-icon {
  flex-shrink: 0;
}

.message-input {
  flex: 1;
  background-color: #f3f4f6 !important;
  border-radius: 40rpx !important;
  padding: 0 32rpx !important;
}

.send-btn {
  flex-shrink: 0;
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  background-color: #ccc;
  transition: background-color 0.2s;
}

.send-btn-active {
  background-color: var(--td-brand-color, #0052D9);
}

.send-btn-text {
  font-size: 28rpx;
  color: #fff;
}
</style>
