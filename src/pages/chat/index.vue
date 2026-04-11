<template>
  <view class="chat-page">
    <!-- 移除 t-navbar，由原生导航栏处理标题 -->

    <scroll-view 
      class="message-scroll" 
      scroll-y 
      :scroll-into-view="scrollId"
      enhanced 
      :show-scrollbar="false"
    >
      <view class="msg-list">
        <view 
          v-for="(msg, index) in messages" 
          :key="msg.id" 
          :id="'msg-' + msg.id"
          class="msg-item"
          :class="msg.isSelf ? 'msg-self' : 'msg-peer'"
        >
          <t-avatar :image="msg.avatar" size="80rpx" class="msg-avatar" />
          <view class="msg-content">
            <text v-if="!msg.isSelf" class="sender-name">{{ msg.sender }}</text>
            <view class="chat-bubble" :class="msg.isSelf ? 'chat-bubble-self' : 'chat-bubble-peer'">
              {{ msg.text }}
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入栏 -->
    <view class="chat-footer">
      <t-icon name="view-module" size="56rpx" color="#666" class="footer-icon" />
      <t-input
        v-model="inputMsg"
        placeholder="发送消息..."
        :border="false"
        class="message-input"
        confirm-type="send"
        @confirm="sendMessage"
      />
      <t-icon name="smiley" size="56rpx" color="#666" class="footer-icon" />
      <t-icon name="add-circle" size="56rpx" color="#666" class="footer-icon" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const inputMsg = ref('');
const scrollId = ref('');

const messages = ref([
  { id: 1, sender: '小李', text: '那个H5页面的原型出来了吗？', avatar: 'https://i.pravatar.cc/150?img=32', isSelf: false },
  { id: 2, sender: '我', text: '正在导出，大概还要10分钟。', avatar: 'https://i.pravatar.cc/150?img=11', isSelf: true },
  { id: 3, sender: '小李', text: '好的，发出来艾特我一下。', avatar: 'https://i.pravatar.cc/150?img=32', isSelf: false },
]);

onLoad((options) => {
  // 动态修改原生导航栏标题
  if (options && options.name) {
    uni.setNavigationBarTitle({ title: options.name });
  }
});

const sendMessage = () => {
  if (!inputMsg.value.trim()) return;
  const newId = messages.value.length + 1;
  messages.value.push({
    id: newId,
    sender: '我',
    text: inputMsg.value,
    avatar: 'https://i.pravatar.cc/150?img=11',
    isSelf: true
  });
  inputMsg.value = '';
  setTimeout(() => {
    scrollId.value = 'msg-' + newId;
  }, 100);
};
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

.chat-footer {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  gap: 20rpx;
}

.message-input {
  flex: 1;
  background-color: #f3f4f6 !important;
  border-radius: 40rpx !important;
  padding: 0 32rpx !important;
}

.footer-icon {
  flex-shrink: 0;
}
</style>
