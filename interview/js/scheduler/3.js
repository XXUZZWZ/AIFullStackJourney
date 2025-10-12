// 更简洁、接近 2.js 的写法，同时保留必要的健壮性
class Scheduler {
  constructor(maxConcurrency = 2) {
    // 保障为正整数，便于面试时快速书写
    this.maxConcurrency = Math.max(1, maxConcurrency | 0);
    this.running = 0;
    this.queue = [];
  }

  addTask(task) {
    return new Promise((resolve, reject) => {
      const run = () => {
        this.running++;
        try {
          Promise.resolve(task())
            .then(resolve, reject)
            .finally(() => {
              this.running--;
              this.run();
            });
        } catch (e) {
          // 同步抛错兜底，防止计数失衡
          this.running--;
          this.run();
          reject(e);
        }
      };
      this.queue.push(run);
      this.run();
    });
  }

  run() {
    while (this.running < this.maxConcurrency && this.queue.length) {
      const fn = this.queue.shift();
      fn();
    }
  }
}

// 演示用例（与 2.js 类似）
const t1 = () =>
  new Promise((r) =>
    setTimeout(() => {
      console.log("任务1执行");
      r(1);
    }, 1000)
  );
const t2 = () =>
  new Promise((r) =>
    setTimeout(() => {
      console.log("任务2执行");
      r(2);
    }, 2000)
  );
const t3 = () =>
  new Promise((r) =>
    setTimeout(() => {
      console.log("任务3执行");
      r(3);
    }, 1000)
  );
const t4 = () =>
  new Promise((r) =>
    setTimeout(() => {
      console.log("任务4执行");
      r(4);
    }, 1000)
  );

const scheduler = new Scheduler(2);
scheduler.addTask(t1);
scheduler.addTask(t2);
scheduler.addTask(t3);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
scheduler.addTask(t4);
