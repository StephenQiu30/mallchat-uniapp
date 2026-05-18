<template>
  <view class="profile-page">
    <scroll-view scroll-y class="profile-scroll">
      <!-- 用户信息卡片 -->
      <view class="user-card-section" @click="goToEditProfile">
        <view class="user-card">
          <t-avatar :image="userInfo.userAvatar" size="120rpx" shape="round" />
          <view class="user-info">
            <text class="user-name">{{ userInfo.userName || '未设置昵称' }}</text>
            <text class="user-id">ID: {{ userInfo.id }}</text>
            <view class="user-tags">
              <t-tag size="small" theme="primary" variant="light-outline" shape="round">
                {{ userInfo.userRole || '普通用户' }}
              </t-tag>
            </view>
          </view>
          <t-icon name="chevron-right" size="48rpx" color="#ccc" />
        </view>
      </view>

      <!-- 个人简介 -->
      <view v-if="userInfo.userProfile" class="profile-desc-section">
        <text class="profile-desc">{{ userInfo.userProfile }}</text>
      </view>

      <!-- 菜单列表 -->
      <view class="menu-sections">
        <t-cell-group :border="false" class="menu-group">
          <t-cell title="通知中心" arrow hover @click="goToNotification">
            <template #left-icon>
              <t-icon name="notification" color="#FF9500" size="48rpx" />
            </template>
            <template v-if="unreadNotification > 0" #note>
              <t-badge :count="unreadNotification" shape="circle" />
            </template>
          </t-cell>
          <t-cell title="编辑资料" arrow hover @click="goToEditProfile">
            <template #left-icon>
              <t-icon name="edit" color="#0052D9" size="48rpx" />
            </template>
          </t-cell>
        </t-cell-group>

        <t-cell-group :border="false" class="menu-group">
          <t-cell title="设置" arrow hover @click="goToSettings">
            <template #left-icon>
              <t-icon name="setting" color="#666" size="48rpx" />
            </template>
          </t-cell>
        </t-cell-group>
      </view>

      <!-- 退出登录 -->
      <view class="logout-btn-box" @click="handleLogout">
        <text class="logout-text">退出登录</text>
      </view>

      <view class="footer-note">
        <text>MallChat v1.0.0</text>
      </view>

      <view class="safe-area-bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import userApi from '@/api/user'
import notificationApi from '@/api/notification'
import { getUserInfo, setUserInfo, removeToken, removeUserInfo } from '@/utils/auth'
import { wsManager } from '@/services/websocket'

const userInfo = ref<UserAPI.LoginUserVO>({
  id: 0,
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
})

const unreadNotification = ref(0)

/** 加载用户信息 */
async function loadUserInfo() {
  try {
    const res = await userApi.userController.getLoginUser()
    if (res.data) {
      userInfo.value = res.data
      setUserInfo(res.data)
    }
  } catch (e) {
    console.error('加载用户信息失败', e)
    // 如果请求失败，尝试使用本地缓存
    const cached = getUserInfo()
    if (cached) {
      userInfo.value = cached
    }
  }
}

/** 加载未读通知数 */
async function loadUnreadNotification() {
  try {
    const res = await notificationApi.notificationController.getNotificationUnreadCount()
    if (res.data !== undefined) {
      unreadNotification.value = res.data
    }
  } catch (e) {
    // 静默处理
  }
}

/** 跳转到编辑资料 */
function goToEditProfile() {
  uni.navigateTo({ url: '/pages/profile/edit' })
}

/** 跳转到通知中心 */
function goToNotification() {
  uni.navigateTo({ url: '/pages/profile/notification' })
}

/** 跳转到设置 */
function goToSettings() {
  uni.navigateTo({ url: '/pages/profile/settings' })
}

/** 退出登录 */
function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await userApi.userController.userLogout()
        } catch {
          // 即使请求失败也继续清理
        }

        // 断开 WebSocket
        wsManager.disconnect()

        // 清除本地数据
        removeToken()
        removeUserInfo()

        uni.showToast({ title: '已退出登录', icon: 'none' })

        // 跳转到登录页或重新启动
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/index/index' })
        }, 1000)
      }
    },
  })
}

onMounted(() => {
  loadUserInfo()
  loadUnreadNotification()
})

onShow(() => {
  loadUserInfo()
  loadUnreadNotification()
})
</script>

<style scoped>
.profile-page {
  background-color: var(--app-bg-color);
  height: 100vh;
}

.profile-scroll {
  height: 100%;
}

.user-card-section {
  padding: 30rpx;
  background-color: #fff;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}

.user-info {
  flex: 1;
  margin-left: 30rpx;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 40rpx;
  font-weight: bold;
  color: var(--app-text-primary);
  margin-bottom: 8rpx;
}

.user-id {
  font-size: 24rpx;
  color: var(--app-text-secondary);
  margin-bottom: 12rpx;
}

.user-tags {
  display: flex;
}

.profile-desc-section {
  padding: 0 30rpx 24rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.profile-desc {
  font-size: 26rpx;
  color: var(--app-text-secondary);
  line-height: 1.6;
}

.menu-sections {
  margin-top: 20rpx;
}

.menu-group {
  margin-bottom: 20rpx;
}

.logout-btn-box {
  margin-top: 40rpx;
  padding: 30rpx;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logout-text {
  color: #FA5151;
  font-size: 32rpx;
  font-weight: 500;
}

.footer-note {
  padding: 40rpx;
  text-align: center;
}

.footer-note text {
  font-size: 24rpx;
  color: #ccc;
}

.safe-area-bottom {
  height: calc(env(safe-area-inset-bottom) + 120rpx);
}
</style>
