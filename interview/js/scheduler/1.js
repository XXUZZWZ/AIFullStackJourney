class TaskScheduler {
  constructor(maxConcurrency = 2) {
    this.maxConcurrency = maxConcurrency;
    this.runningCount = 0; // 正在执行的任务数量
    this.taskQueue = []; // FIFO
  }
  addTask(task) {
    return new Promise((resolve, reject) => {
      const run = () => {
        this.runningCount++;
        task()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.runningCount--;
            this.schedule();
          });
      };
      this.taskQueue.push(run);
      this.schedule();
    });
  }
  schedule() {
    while (
      this.runningCount < this.maxConcurrency &&
      this.taskQueue.length > 0
    ) {
      const task = this.taskQueue.shift();
      task();
    }
  }
}
const tasks1 = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("任务1执行");
      resolve(1);
    }, 1000)
  );

const tasks2 = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("任务2执行");
      resolve(2);
    }, 2000)
  );

const tasks3 = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("任务3执行");
      resolve(3);
    }, 1000)
  );

const tasks4 = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("任务4执行");
      resolve(4);
    }, 1000)
  );

const scheduler = new TaskScheduler(2);
scheduler.addTask(tasks1);
scheduler.addTask(tasks2);
scheduler.addTask(tasks3);
scheduler.addTask(tasks4);
