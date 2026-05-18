<template>
  <view class="contact-page">
    <!-- 搜索区域 -->
    <view class="header-section">
      <t-search
        v-model="searchKeyword"
        shape="round"
        placeholder="搜索联系人"
        :border="false"
      />
    </view>

    <scroll-view scroll-y class="scroll-container">
      <!-- 功能菜单 -->
      <view class="functional-menu">
        <t-cell-group :border="false">
          <t-cell title="新朋友" arrow hover @click="goToNewFriends">
            <template #left-icon>
              <view class="service-icon orange-gradient">
                <t-icon name="user-add" size="44rpx" color="#fff" />
              </view>
            </template>
            <template v-if="applyCount > 0" #note>
              <t-badge :count="applyCount" shape="circle" />
            </template>
          </t-cell>
          <t-cell title="群聊" arrow hover @click="goToGroups">
            <template #left-icon>
              <view class="service-icon blue-gradient">
                <t-icon name="usergroup" size="44rpx" color="#fff" />
              </view>
            </template>
          </t-cell>
        </t-cell-group>
      </view>

      <!-- 字母索引分组列表 -->
      <view v-for="group in filteredGroups" :key="group.letter" class="letter-group">
        <view class="letter-header">
          <text class="letter-text">{{ group.letter }}</text>
        </view>
        <t-cell-group :border="false">
          <t-cell
            v-for="friend in group.friends"
            :key="friend.id"
            :title="friend.userName"
            :description="friend.onlineStatus === 1 ? '[在线]' : '[离线]'"
            hover
            @click="goToChat(friend)"
          >
            <template #left-icon>
              <t-avatar :image="friend.userAvatar" size="80rpx" class="contact-avatar" />
            </template>
          </t-cell>
        </t-cell-group>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && filteredGroups.length === 0" class="empty-state">
        <t-icon name="user" size="120rpx" color="#ccc" />
        <text class="empty-text">暂无联系人</text>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <t-loading size="40rpx" />
      </view>

      <!-- 底部统计 -->
      <view v-if="friends.length > 0" class="list-footer">
        <text>{{ friends.length }} 位联系人</text>
      </view>

      <view class="safe-area-bottom" />
    </scroll-view>

    <!-- 右侧字母索引栏 -->
    <view class="index-bar" v-if="filteredGroups.length > 0">
      <view
        v-for="group in filteredGroups"
        :key="group.letter"
        class="index-item"
        @click="scrollToLetter(group.letter)"
      >
        <text class="index-text">{{ group.letter }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import chatApi from '@/api/chat'

interface FriendGroup {
  letter: string
  friends: ChatAPI.ChatFriendUserVO[]
}

const searchKeyword = ref('')
const friends = ref<ChatAPI.ChatFriendUserVO[]>([])
const loading = ref(false)
const applyCount = ref(0)

/** 获取拼音首字母（简单实现，取用户名第一个字符的大写） */
function getFirstLetter(name?: string): string {
  if (!name) return '#'
  const first = name.charAt(0).toUpperCase()
  if (/[A-Z]/.test(first)) return first
  // 中文字符映射到拼音首字母（简化处理）
  const charCode = name.charCodeAt(0)
  if (charCode >= 0x4e00 && charCode <= 0x9fff) {
    // 简单的中文排序：按 Unicode 编码分组
    return '#'
  }
  return '#'
}

/** 将好友列表按首字母分组 */
const letterGroups = computed<FriendGroup[]>(() => {
  const map = new Map<string, ChatAPI.ChatFriendUserVO[]>()

  for (const friend of friends.value) {
    const letter = getFirstLetter(friend.userName)
    if (!map.has(letter)) {
      map.set(letter, [])
    }
    map.get(letter)!.push(friend)
  }

  // 排序：A-Z 在前，# 在后
  const sorted = Array.from(map.entries()).sort(([a], [b]) => {
    if (a === '#') return 1
    if (b === '#') return -1
    return a.localeCompare(b)
  })

  return sorted.map(([letter, list]) => ({ letter, friends: list }))
})

/** 搜索过滤后的分组 */
const filteredGroups = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return letterGroups.value

  return letterGroups.value
    .map((group) => ({
      ...group,
      friends: group.friends.filter((f) =>
        f.userName && f.userName.toLowerCase().includes(keyword)
      ),
    }))
    .filter((group) => group.friends.length > 0)
})

/** 加载好友列表 */
async function loadFriends() {
  loading.value = true
  try {
    const res = await chatApi.chatFriendController.listFriends()
    if (res.data) {
      friends.value = res.data
    }
  } catch (e) {
    console.error('加载好友列表失败', e)
  } finally {
    loading.value = false
  }
}

/** 加载好友申请数量 */
async function loadApplyCount() {
  try {
    const res = await chatApi.chatFriendApplyController.listFriendApply({
      current: 1,
      pageSize: 1,
    })
    if (res.data) {
      applyCount.value = res.data.total || 0
    }
  } catch (e) {
    // 静默处理
  }
}

/** 跳转到新朋友页面 */
function goToNewFriends() {
  uni.navigateTo({ url: '/pages/contact/new-friends' })
}

/** 跳转到群聊列表 */
function goToGroups() {
  uni.navigateTo({ url: '/pages/contact/groups' })
}

/** 进入私聊 */
async function goToChat(friend: ChatAPI.ChatFriendUserVO) {
  try {
    const res = await chatApi.chatRoomController.getOrCreatePrivateRoom({
      peerUserId: friend.id!,
    })
    if (res.data) {
      uni.navigateTo({
        url: `/pages/chat/index?roomId=${res.data}&name=${encodeURIComponent(friend.userName || '')}`,
      })
    }
  } catch (e) {
    console.error('获取聊天房间失败', e)
  }
}

/** 滚动到指定字母 */
function scrollToLetter(letter: string) {
  // 简单实现：使用 page scroll to
  uni.showToast({ title: letter, icon: 'none', duration: 500 })
}

onMounted(() => {
  loadFriends()
  loadApplyCount()
})

onShow(() => {
  loadFriends()
  loadApplyCount()
})
</script>

<style scoped>
.contact-page {
  background-color: var(--app-bg-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header-section {
  background-color: #fff;
  padding: 16rpx 32rpx;
}

.scroll-container {
  flex: 1;
  overflow: hidden;
}

.functional-menu {
  margin-bottom: 20rpx;
}

.service-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.orange-gradient {
  background: linear-gradient(135deg, #FF9500, #FF5E00);
}

.blue-gradient {
  background: linear-gradient(135deg, #007AFF, #0046FF);
}

.letter-group {
  margin-bottom: 0;
}

.letter-header {
  padding: 16rpx 32rpx 8rpx;
  background-color: var(--app-bg-color);
}

.letter-text {
  font-size: 26rpx;
  color: var(--app-text-secondary);
  font-weight: 500;
}

.contact-avatar {
  margin-right: 24rpx;
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

.list-footer {
  padding: 40rpx;
  text-align: center;
  color: var(--app-text-secondary);
  font-size: 24rpx;
}

.index-bar {
  position: fixed;
  right: 16rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.index-item {
  padding: 6rpx 12rpx;
}

.index-text {
  font-size: 22rpx;
  color: var(--app-text-secondary);
}

.safe-area-bottom {
  height: calc(env(safe-area-inset-bottom) + 120rpx);
}
</style>
