import { useRef, useEffect } from 'react'


export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef(value)
  useEffect(() => {
    console.log('effect(before set): prevRef.current =', ref.current, 'value =', value);

    ref.current = value
    // 因为这个时候 页面上的 value 是更新过的，但是 实际的value 还是之前一个状态 可以用ref.current 拿到之前一个状态
    console.log('effect(after set):  prevRef.current =', ref.current, 'value =', value);

  }, [value])
  return ref.current as T | undefined
}