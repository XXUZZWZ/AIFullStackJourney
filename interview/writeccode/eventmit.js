class EventEmitter {
  constructor() {
    // 维护一个callbacks 订阅者
    this.events = {}; // type,[] 一个type 可以监听很多事件
  }
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emitter(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => {
      callback.apply(this, args);
    });
  }
  // removeEventListener type + callback
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }
  once() {}
}

const ws = new EventEmitter();

ws.on("offer", () => {
  console.log("万达走一波");
});
ws.on("btyeDance", (data) => {
  console.log("卢的高傲", data);
});

// ws.emitter("offer");
ws.emitter("btyeDance", "你不懂");

setInterval(() => {
  ws.emitter("btyeDance", "你不懂");
  ws.emitter("offer");
}, 200);
