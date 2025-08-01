import mitt from "mitt";

// 事件总线eventbus

// 让组件基于事件触发

// 自定义事件

// 实例化
export const toastEvents = mitt();

export const showToast = (user = 0, bell = 0, mail = 0) => {
  // 任何想要与toast 通信的地方调用
  // emit 发布事件
  toastEvents.emit("show", { user, bell, mail });
};
