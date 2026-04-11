<template>
  <view class="contact-page">
    <!-- 头部搜索区域 -->
    <view class="header-section">
      <view class="search-container">
        <t-search shape="round" placeholder="搜索内容" :border="false" />
      </view>
    </view>

    <view class="scroll-container">
      <t-indexes :index-list="indexList" @select="onIndexSelect">
        <!-- 顶部功能菜单：作为第一个锚点前的 slot 或者放在单独区域 -->
        <view class="functional-menu">
          <t-cell-group :border="false">
            <t-cell title="新朋友" arrow hover @click="handleAction('new-friends')">
              <template #left-icon>
                <view class="service-icon orange-gradient">
                  <t-icon name="user-add" size="44rpx" color="#fff" />
                </view>
              </template>
              <template #note>
                <t-badge count="3" shape="circle" />
              </template>
            </t-cell>
            <t-cell title="群聊" arrow hover @click="handleAction('groups')">
              <template #left-icon>
                <view class="service-icon blue-gradient">
                  <t-icon name="usergroup" size="44rpx" color="#fff" />
                </view>
              </template>
            </t-cell>
            <t-cell title="公众号" arrow hover @click="handleAction('official')">
              <template #left-icon>
                <view class="service-icon green-gradient">
                  <t-icon name="view-module" size="44rpx" color="#fff" />
                </view>
              </template>
            </t-cell>
          </t-cell-group>
        </view>

        <!-- A-Z 联系人列表 -->
        <template v-for="group in alphabetContacts" :key="group.index">
          <t-indexes-anchor :index="group.index" />
          <t-cell
            v-for="user in group.list"
            :key="user.id"
            :title="user.name"
            :description="user.desc"
            hover
            @click="goToChat(user)"
          >
            <template #left-icon>
              <t-avatar :image="user.avatar" size="80rpx" class="contact-avatar" />
            </template>
          </t-cell>
        </template>
        
        <!-- 底部占位 -->
        <view class="list-footer">
          <text>{{ totalContacts }} 位联系人</text>
        </view>
      </t-indexes>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const indexList = ref(['A', 'B', 'C', 'L', 'Z']);

const alphabetContacts = ref([
  {
    index: 'A',
    list: [
      { id: 1, name: '阿强', desc: '[在线]', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 2, name: '安琪拉', desc: '[离线]', avatar: 'https://i.pravatar.cc/150?img=2' },
    ]
  },
  {
    index: 'B',
    list: [
      { id: 3, name: '碧瑶', desc: '[在线]', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: 4, name: '白小纯', desc: '[忙碌]', avatar: 'https://i.pravatar.cc/150?img=4' },
    ]
  },
  {
    index: 'C',
    list: [
      { id: 5, name: '陈长生', desc: '[离线]', avatar: 'https://i.pravatar.cc/150?img=5' },
    ]
  },
  {
    index: 'L',
    list: [
      { id: 6, name: '陆雪琪', desc: '[在线]', avatar: 'https://i.pravatar.cc/150?img=6' },
      { id: 7, name: '林惊羽', desc: '[离线]', avatar: 'https://i.pravatar.cc/150?img=7' },
    ]
  },
  {
    index: 'Z',
    list: [
      { id: 8, name: '张小凡', desc: '[在线]', avatar: 'https://i.pravatar.cc/150?img=8' },
    ]
  }
]);

const totalContacts = computed(() => {
  return alphabetContacts.value.reduce((total, group) => total + group.list.length, 0);
});

const onIndexSelect = (detail: any) => {
  console.log('Index select:', detail);
};

const handleAction = (type: string) => {
  console.log('Action:', type);
};

const goToChat = (user: any) => {
  uni.navigateTo({
    url: `/pages/chat/index?id=${user.id}&name=${user.name}`
  });
};
</script>

<style scoped>
.contact-page {
  background-color: var(--app-bg-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-section {
  background-color: #fff;
  padding: 16rpx 32rpx;
}

.search-container {
  background-color: #f3f4f6;
  border-radius: 40rpx;
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

.orange-gradient { background: linear-gradient(135deg, #FF9500, #FF5E00); }
.blue-gradient { background: linear-gradient(135deg, #007AFF, #0046FF); }
.green-gradient { background: linear-gradient(135deg, #34C759, #248A3D); }

.contact-avatar {
  margin-right: 24rpx;
}

.list-footer {
  padding: 40rpx;
  text-align: center;
  color: var(--app-text-secondary);
  font-size: 24rpx;
  background-color: var(--app-bg-color);
}
</style>
