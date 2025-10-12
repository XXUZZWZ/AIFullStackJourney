class Scheduler {
  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
    this.runningTasks = 0;
    this.taskQueue = []; // 作为队列
  }
  addTask(task) {
    this.taskQueue.push(task);
    this.run();
  }

  run() {
    while (this.runningTasks < this.maxConcurrency && this.taskQueue.length) {
      const task = this.taskQueue.shift();
      this.runningTasks++;
      task().finally(() => {
        this.runningTasks--;
        this.run();
      });
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
const scheduler = new Scheduler(2);
scheduler.addTask(tasks1);
scheduler.addTask(tasks2);
scheduler.addTask(tasks3);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
scheduler.addTask(tasks4);
