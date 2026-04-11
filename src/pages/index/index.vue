<template>
  <view class="message-page">
    <!-- 顶部搜素栏：置于原生导航栏之下 -->
    <view class="search-section">
      <t-search
        v-model="searchKeyword"
        shape="round"
        placeholder="搜索消息、联系人、群聊"
        :border="false"
        class="custom-search"
      />
    </view>

    <!-- 消息列表区 -->
    <scroll-view scroll-y class="message-scroll">
      <view class="list-container">
        <t-cell-group :border="false">
          <t-cell
            v-for="(chat, index) in chatList"
            :key="chat.id"
            :title="chat.title"
            :description="chat.lastMsg"
            @click="goToChat(chat)"
            hover
            class="chat-cell"
          >
            <!-- 左侧头像：如果是群聊则展示渐变背景或组合头像 -->
            <template #left-icon>
              <view class="avatar-wrapper">
                <t-avatar 
                  :image="chat.avatar" 
                  size="96rpx" 
                  shape="round" 
                />
                <!-- 未读数 -->
                <view v-if="chat.unread" class="badge-accent">
                  <t-badge 
                    :count="chat.unread === 'dot' ? 0 : chat.unread" 
                    :dot="chat.unread === 'dot'"
                  />
                </view>
              </view>
            </template>

            <!-- 右侧摘要/时间 -->
            <template #note>
              <view class="chat-note">
                <text class="time-text">{{ chat.time }}</text>
                <t-icon v-if="chat.muted" name="notification-off" size="32rpx" color="#bbb" />
              </view>
            </template>
          </t-cell>
        </t-cell-group>
      </view>
      
      <!-- 底部留白 -->
      <view class="safe-area-bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchKeyword = ref('');

const chatList = ref([
  {
    id: 1,
    title: 'MallChat 项目组',
    lastMsg: '小李：那个 H5 页面的原型出来了吗？',
    time: '14:30',
    avatar: 'https://i.pravatar.cc/150?img=12',
    unread: 5,
    muted: true,
    type: 'group'
  },
  {
    id: 2,
    title: '系统通知',
    lastMsg: '您的账号在异地登录，请注意安全。',
    time: '12:05',
    avatar: 'https://i.pravatar.cc/150?img=1',
    unread: 'dot',
    muted: false,
    type: 'system'
  },
  {
    id: 3,
    title: '微信支付',
    lastMsg: '付款成功：23.50元',
    time: '昨天',
    avatar: 'https://i.pravatar.cc/150?img=5',
    unread: 0,
    muted: false,
    type: 'service'
  },
  {
    id: 4,
    title: '张小凡',
    lastMsg: '今晚一起火锅吗？',
    time: '昨天',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    unread: 0,
    muted: false,
    type: 'user'
  }
]);

const goToChat = (chat: any) => {
  uni.navigateTo({
    url: `/pages/chat/index?id=${chat.id}&name=${chat.title}`
  });
};
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

.safe-area-bottom {
  height: calc(env(safe-area-inset-bottom) + 120rpx);
}
</style>
