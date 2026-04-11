<template>
  <view class="profile-page">
    <scroll-view scroll-y class="profile-scroll">
      <!-- 用户头像和基础信息卡片 -->
      <view class="user-card-section">
        <view class="user-card">
          <t-avatar :image="userInfo.avatar" size="120rpx" shape="round" />
          <view class="user-info">
            <text class="user-name">{{ userInfo.nickname }}</text>
            <text class="user-id">帐号: {{ userInfo.id }}</text>
            <view class="user-tags">
              <t-tag size="small" theme="primary" variant="light-outline" shape="round">SVIP 10</t-tag>
              <t-tag size="small" theme="success" variant="light-outline" shape="round" class="tag-ml">在线</t-tag>
            </view>
          </view>
          <t-icon name="chevron-right" size="48rpx" color="#ccc" />
        </view>
      </view>

      <!-- 统计数据 -->
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-num">128</text>
          <text class="stat-label">动态</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">512</text>
          <text class="stat-label">关注</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">10k</text>
          <text class="stat-label">粉丝</text>
        </view>
      </view>

      <!-- 菜单功能列表 -->
      <view class="menu-sections">
        <t-cell-group :border="false" class="menu-group">
          <t-cell title="我的收藏" arrow hover>
            <template #left-icon>
              <t-icon name="star" color="#FFA000" size="48rpx" />
            </template>
          </t-cell>
          <t-cell title="我的文件" arrow hover>
            <template #left-icon>
              <t-icon name="folder" color="#0052D9" size="48rpx" />
            </template>
          </t-cell>
          <t-cell title="个性装扮" arrow hover>
            <template #left-icon>
              <t-icon name="component-colors" color="#E91E63" size="48rpx" />
            </template>
          </t-cell>
        </t-cell-group>

        <t-cell-group :border="false" class="menu-group">
          <t-cell title="设置" arrow hover>
            <template #left-icon>
              <t-icon name="setting" color="#666" size="48rpx" />
            </template>
          </t-cell>
          <t-cell title="隐私与权限" arrow hover>
            <template #left-icon>
              <t-icon name="security" color="#666" size="48rpx" />
            </template>
          </t-cell>
        </t-cell-group>
      </view>

      <!-- 退出登录 -->
      <view class="logout-btn-box">
        <text class="logout-text">退出登录</text>
      </view>

      <view class="footer-note">
        <text>MallChat v1.0.0 Stable</text>
      </view>
      
      <view class="safe-area-bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userInfo = ref({
  nickname: 'Stephen Qiu',
  id: 'stephen_30',
  avatar: 'https://i.pravatar.cc/150?img=11',
});
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

.tag-ml {
  margin-left: 12rpx;
}

.stats-grid {
  display: flex;
  background-color: #fff;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--app-text-primary);
}

.stat-label {
  font-size: 22rpx;
  color: var(--app-text-secondary);
  margin-top: 4rpx;
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
