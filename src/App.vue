<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { getToken } from '@/utils/auth'
import { wsManager } from '@/services/websocket'

onLaunch(() => {
  console.log('App Launch')
  // 如果有 Token，自动连接 WebSocket
  const token = getToken()
  if (token) {
    wsManager.connect()
  }
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style></style>
