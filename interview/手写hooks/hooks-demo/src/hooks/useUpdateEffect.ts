import {
  useEffect,
  useRef // 一个普通的对象，不会触发依赖更新，本身也不会因为UI渲染改变
} from 'react'

export const useUpdateEffect = (effect: React.EffectCallback, deps: React.DependencyList) => {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      // 第一次执行
      isFirst.current = false;
      return;
    }
    effect();
  }, deps)
}

