import mitt from 'mitt'

// 定义事件类型
type Events = {
  // 基础事件
  'message': string
  'data': any
  'response': any
  'custom-event': any
  'global-notification': any
  'user-message': string
  'custom-response': any
  'broadcast': any

  // 通配符事件
  '*': { type: string; data?: any }
}

// 创建事件发射器
export const emitter = mitt<Events>()

// 插件安装函数
export const EventBusPlugin = {
  install(app: any) {
    // 将事件总线添加到全局属性
    app.config.globalProperties.$eventBus = emitter

    // 提供事件总线给所有组件
    app.provide('eventBus', emitter)

    console.log('EventBus plugin installed')
  }
}

// 工具函数
export const eventBus = {
  // 发送事件
  emit: emitter.emit,

  // 监听事件
  on: emitter.on,

  // 取消监听
  off: emitter.off,

  // 一次性监听
  once: <Key extends keyof Events>(type: Key, handler: (event: Events[Key]) => void) => {
    const wrapper = (event: Events[Key]) => {
      handler(event)
      emitter.off(type, wrapper)
    }
    emitter.on(type, wrapper)
  },

  // 清除所有监听器
  clear: () => {
    Object.keys(emitter.all).forEach(type => {
      emitter.all[type].length = 0
    })
  },

  // 获取活跃监听器数量
  getListenerCount: (type?: keyof Events) => {
    if (type) {
      return emitter.all[type]?.length || 0
    }
    return Object.values(emitter.all).reduce((total, handlers) => total + handlers.length, 0)
  }
}

// 默认导出
export default eventBus