/**
 * WebSocket 服务 - 单例管理器
 * 支持连接/断开/心跳/重连/消息事件分发
 */

import { getToken } from '@/utils/auth'

const WS_URL = import.meta.env.VITE_APP_WS_URL || 'ws://localhost:9090'
const HEARTBEAT_INTERVAL = 30000
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000]

export enum WsMessageType {
  AUTH = 0,
  HEARTBEAT = 1,
  MESSAGE = 2,
  SYSTEM_NOTICE = 3,
  ONLINE_STATUS = 8,
  FRIEND_APPROVE = 10,
  ERROR = 99,
}

export interface WsMessage {
  type: WsMessageType
  data: any
}

type MessageHandler = (msg: WsMessage) => void

class WebSocketManager {
  private socketTask: UniApp.SocketTask | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private reconnectAttempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private isManualClose = false
  private handlers: Map<WsMessageType, Set<MessageHandler>> = new Map()

  /** 建立 WebSocket 连接 */
  connect() {
    const token = getToken()
    if (!token) {
      console.log('[WS] No token, skip connect')
      return
    }

    if (this.socketTask) {
      console.log('[WS] Already connected')
      return
    }

    this.isManualClose = false

    console.log('[WS] Connecting to', WS_URL)

    const socketTask = uni.connectSocket({
      url: WS_URL,
      header: {
        Authorization: `Bearer ${token}`,
      },
      success: () => {
        console.log('[WS] connectSocket success')
      },
      fail: (err) => {
        console.error('[WS] connectSocket fail', err)
      },
    })

    this.setupSocket(socketTask)
  }

  /** 设置 Socket 事件监听 */
  private setupSocket(task: UniApp.SocketTask) {
    this.socketTask = task

    task.onOpen(() => {
      console.log('[WS] Connected')
      this.reconnectAttempt = 0
      this.startHeartbeat()
      this.sendAuth()
    })

    task.onMessage((res) => {
      try {
        const msg: WsMessage = JSON.parse(res.data as string)
        this.handleMessage(msg)
      } catch (e) {
        console.error('[WS] Parse error', e)
      }
    })

    task.onClose(() => {
      console.log('[WS] Disconnected')
      this.clearTimers()
      this.socketTask = null
      if (!this.isManualClose) {
        this.scheduleReconnect()
      }
    })

    task.onError((err) => {
      console.error('[WS] Error', err)
    })
  }

  /** 断开连接 */
  disconnect() {
    this.isManualClose = true
    this.clearTimers()
    if (this.socketTask) {
      this.socketTask.close({})
      this.socketTask = null
    }
  }

  /** 发送消息 */
  send(data: any) {
    if (!this.socketTask) {
      console.warn('[WS] Not connected, cannot send')
      return false
    }
    this.socketTask.send({
      data: JSON.stringify(data),
    })
    return true
  }

  /** 注册消息处理器 */
  on(type: WsMessageType, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler)
    return () => this.off(type, handler)
  }

  /** 移除消息处理器 */
  off(type: WsMessageType, handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler)
  }

  /** 发送认证消息 */
  private sendAuth() {
    const token = getToken()
    this.send({
      type: WsMessageType.AUTH,
      data: { token },
    })
  }

  /** 启动心跳定时器 */
  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: WsMessageType.HEARTBEAT, data: {} })
    }, HEARTBEAT_INTERVAL)
  }

  /** 调度重连 */
  private scheduleReconnect() {
    const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS.length - 1)]
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempt + 1})`)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempt++
      this.connect()
    }, delay)
  }

  /** 清除所有定时器 */
  private clearTimers() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  /** 处理收到的消息并分发给已注册的处理器 */
  private handleMessage(msg: WsMessage) {
    const handlers = this.handlers.get(msg.type)
    if (handlers) {
      handlers.forEach((handler) => handler(msg))
    }
  }

  /** 获取连接状态 */
  get connected(): boolean {
    return this.socketTask !== null
  }
}

export const wsManager = new WebSocketManager()
