import { ref, computed } from "vue";

export function useTodo() {
  // 定义响应式数据
  const title = ref("");
  const todos = ref([
    { title: "学习VUE", done: false }, // 初始数据
  ]);

  // 添加待办项
  function addTodo() {
    if (title.value.trim()) {
      todos.value.push({
        title: title.value,
        done: false,
      });
      title.value = ""; // 清空输入
    }
  }

  // 删除待办项 (按索引)
  function removeTodo(index) {
    todos.value.splice(index, 1);
  }

  // 清除已完成
  function clear() {
    todos.value = todos.value.filter((todo) => !todo.done);
  }

  // 计算属性：未完成数量
  const active = computed(() => todos.value.filter((v) => !v.done).length);

  // 计算属性：总数
  const all = computed(() => todos.value.length);

  // 计算属性：全选状态
  const allDone = computed({
    get: () => active.value === 0 && all.value > 0,
    set: (value) => {
      todos.value.forEach((todo) => {
        todo.done = value;
      });
    },
  });

  return {
    title,
    todos,
    addTodo,
    removeTodo,
    clear,
    active,
    all,
    allDone,
  };
}
