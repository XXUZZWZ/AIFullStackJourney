//  封装
// callback fn
// useEffect remove

import { useEffect, useRef } from "react";

export default function useInterval(callback, delay) {
  // 创建一个全局的可变的引用对象，用current 保存最新的值
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // 添加定时器
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay == null) return;
    //const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

// 简短版本
export function useInterval2(callback, delay) {
  const intervalId = setInterval(callback, delay);
  return () => clearInterval(intervalId);
}
