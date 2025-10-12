// 极简版 Hooks 机制：通过“调用顺序”分配状态槽位
// 仅用于演示，不包含完整的 React 能力

let hookStates = [];
let hookIndex = 0;

function resetHookIndex() {
  hookIndex = 0;
}

function useState(initialState) {
  const currentIndex = hookIndex++;
  if (hookStates[currentIndex] === undefined) {
    hookStates[currentIndex] = initialState;
  }
  const setState = (valueOrUpdater) => {
    const nextValue = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(hookStates[currentIndex])
      : valueOrUpdater;
    hookStates[currentIndex] = nextValue;
  };
  return [hookStates[currentIndex], setState];
}

function useEffect(effect, deps) {
  const currentIndex = hookIndex++;
  const prevDeps = hookStates[currentIndex];
  let hasChanged = true;
  if (prevDeps) {
    hasChanged = deps.some((d, i) => !Object.is(d, prevDeps[i]));
  }
  if (hasChanged) {
    const cleanup = hookStates[currentIndex + ':cleanup'];
    if (typeof cleanup === 'function') cleanup();
    const ret = effect();
    hookStates[currentIndex + ':cleanup'] = typeof ret === 'function' ? ret : undefined;
    hookStates[currentIndex] = deps;
  }
}

// 错误示例：在条件里调用 Hook，导致序列不稳定 → 槽位错位
function AppBad({ show }) {
  const [a] = useState('A');
  if (show) {
    const [b] = useState('B'); // ❌ 条件内调用，可能在某次渲染中消失
    console.log('AppBad b =', b);
  }
  const [c] = useState('C');
  console.log('AppBad a =', a, 'c =', c);
}

// 正确示例：顶层稳定顺序，条件仅决定“是否使用”
function AppGood({ show }) {
  const [a] = useState('A');
  const [b] = useState('B'); // ✅ 始终占据第二个槽位
  const [c] = useState('C');
  if (show) {
    console.log('AppGood b =', b);
  }
  console.log('AppGood a =', a, 'c =', c);
}

// 简易“渲染器”：重置 hookIndex，调用函数组件
function render(Component, props) {
  resetHookIndex();
  Component(props);
}

// --- 演示开始 ---
console.log('--- BAD: 第一次渲染 show=true ---');
render(AppBad, { show: true });
console.log('hookStates =', hookStates);

console.log('\n--- BAD: 第二次渲染 show=false（b 的 useState 不再被调用，槽位错位） ---');
render(AppBad, { show: false });
console.log('hookStates =', hookStates, '\n');

// 清理并演示正确写法
hookStates = [];
console.log('--- GOOD: 第一次渲染 show=true ---');
render(AppGood, { show: true });
console.log('hookStates =', hookStates);

console.log('\n--- GOOD: 第二次渲染 show=false（顺序稳定，无错位） ---');
render(AppGood, { show: false });
console.log('hookStates =', hookStates);