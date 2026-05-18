<template>
  <view class="message-page">
    <!-- 搜索栏 -->
    <view class="search-section">
      <t-search
        v-model="searchKeyword"
        shape="round"
        placeholder="搜索消息、联系人、群聊"
        :border="false"
        class="custom-search"
      />
    </view>

    <!-- 消息列表 -->
    <scroll-view
      scroll-y
      class="message-scroll"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="list-container">
        <t-cell-group :border="false">
          <t-cell
            v-for="session in filteredSessions"
            :key="session.roomId"
            :title="session.name"
            :description="session.lastMessage"
            @click="goToChat(session)"
            @longpress="onLongPress(session)"
            hover
            class="chat-cell"
          >
            <template #left-icon>
              <view class="avatar-wrapper">
                <t-avatar
                  :image="session.avatar"
                  size="96rpx"
                  shape="round"
                />
                <view v-if="session.unreadCount && session.unreadCount > 0" class="badge-accent">
                  <t-badge :count="session.unreadCount" />
                </view>
              </view>
            </template>

            <template #note>
              <view class="chat-note">
                <text class="time-text">{{ formatTime(session.activeTime) }}</text>
                <t-icon
                  v-if="session.topStatus === 1"
                  name="notification-off"
                  size="32rpx"
                  color="#bbb"
                />
              </view>
            </template>
          </t-cell>
        </t-cell-group>

        <!-- 空状态 -->
        <view v-if="!loading && filteredSessions.length === 0" class="empty-state">
          <t-icon name="chat" size="120rpx" color="#ccc" />
          <text class="empty-text">暂无消息</text>
        </view>

        <!-- 加载状态 -->
        <view v-if="loading" class="loading-state">
          <t-loading size="40rpx" />
        </view>
      </view>

      <view class="safe-area-bottom" />
    </scroll-view>

    <!-- 长按操作菜单 -->
    <t-action-sheet
      v-model:visible="showActionSheet"
      :actions="actionSheetActions"
      @selected="onActionSelected"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import chatApi from '@/api/chat'
import { wsManager, WsMessageType } from '@/services/websocket'

const searchKeyword = ref('')
const sessions = ref<ChatAPI.ChatSessionVO[]>([])
const loading = ref(false)
const refreshing = ref(false)
const showActionSheet = ref(false)
const selectedSession = ref<ChatAPI.ChatSessionVO | null>(null)

const actionSheetActions = computed(() => {
  if (!selectedSession.value) return []
  const isTop = selectedSession.value.topStatus === 1
  return [
    { label: isTop ? '取消置顶' : '置顶聊天', value: 'top' },
    { label: '删除会话', value: 'delete', theme: 'danger' },
  ]
})

const filteredSessions = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return sessions.value
  return sessions.value.filter(
    (s) =>
      (s.name && s.name.toLowerCase().includes(keyword)) ||
      (s.lastMessage && s.lastMessage.toLowerCase().includes(keyword))
  )
})

/** 格式化时间显示 */
function formatTime(time?: string): string {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isToday) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) return '昨天'

  return `${date.getMonth() + 1}/${date.getDate()}`
}

/** 加载会话列表 */
async function loadSessions() {
  loading.value = true
  try {
    const res = await chatApi.chatSessionController.listMySessions()
    if (res.data) {
      sessions.value = res.data.sort((a, b) => {
        // 置顶优先
        if (a.topStatus === 1 && b.topStatus !== 1) return -1
        if (a.topStatus !== 1 && b.topStatus === 1) return 1
        // 按活跃时间倒序
        const timeA = a.activeTime ? new Date(a.activeTime).getTime() : 0
        const timeB = b.activeTime ? new Date(b.activeTime).getTime() : 0
        return timeB - timeA
      })
    }
  } catch (e) {
    console.error('加载会话列表失败', e)
  } finally {
    loading.value = false
  }
}

/** 下拉刷新 */
async function onRefresh() {
  refreshing.value = true
  await loadSessions()
  refreshing.value = false
}

/** 进入聊天页面 */
function goToChat(session: ChatAPI.ChatSessionVO) {
  uni.navigateTo({
    url: `/pages/chat/index?roomId=${session.roomId}&name=${encodeURIComponent(session.name || '')}`,
  })
}

/** 长按弹出操作菜单 */
function onLongPress(session: ChatAPI.ChatSessionVO) {
  selectedSession.value = session
  showActionSheet.value = true
}

/** 操作菜单选择 */
async function onActionSelected(action: { value: string }) {
  if (!selectedSession.value) return
  const session = selectedSession.value

  if (action.value === 'top') {
    try {
      const newStatus = session.topStatus === 1 ? 0 : 1
      await chatApi.chatSessionController.topSession({
        roomId: session.roomId!,
        status: newStatus,
      })
      session.topStatus = newStatus
      uni.showToast({ title: newStatus === 1 ? '已置顶' : '已取消置顶', icon: 'none' })
    } catch (e) {
      console.error('置顶操作失败', e)
    }
  } else if (action.value === 'delete') {
    uni.showModal({
      title: '提示',
      content: '确定删除该会话吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await chatApi.chatSessionController.deleteSession({ id: session.roomId! })
            sessions.value = sessions.value.filter((s) => s.roomId !== session.roomId)
            uni.showToast({ title: '已删除', icon: 'none' })
          } catch (e) {
            console.error('删除会话失败', e)
          }
        }
      },
    })
  }

  showActionSheet.value = false
  selectedSession.value = null
}

/** 监听 WebSocket 新消息 */
function handleWsMessage(msg: any) {
  // 收到新消息时刷新会话列表
  loadSessions()
}

onMounted(() => {
  loadSessions()
  // 注册 WebSocket 消息监听
  wsManager.on(WsMessageType.MESSAGE, handleWsMessage)
})

onShow(() => {
  // 每次显示页面时刷新列表
  loadSessions()
})
</script>

<style scoped>
.message-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--app-bg-color);
}

.search-section {
  padding: 16rpx 32rpx;
  background-color: #fff;
}

.custom-search {
  --td-search-bg-color: #f3f4f6;
}

.message-scroll {
  flex: 1;
  overflow: hidden;
}

.list-container {
  padding-top: 10rpx;
}

.chat-cell {
  --td-cell-vertical-padding: 24rpx;
  --td-cell-horizontal-padding: 32rpx;
}

.avatar-wrapper {
  position: relative;
  margin-right: 24rpx;
}

.badge-accent {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
}

.chat-note {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
}

.time-text {
  font-size: 24rpx;
  color: var(--app-text-secondary);
  margin-bottom: 8rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.empty-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #ccc;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
}

.safe-area-bottom {
  height: calc(env(safe-area-inset-bottom) + 120rpx);
}
</style>
