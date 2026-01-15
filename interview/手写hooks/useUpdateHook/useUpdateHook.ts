import { useEffect, useRef } from 'react'

/**
 * useUpdateEffect - 跳过首次渲染，只在依赖项变化时执行 effect
 * @param {Function} effect - 副作用函数
 * @param {Array<any>} deps - 依赖项数组
 */
export const useUpdateEffect = (effect: () => void | (() => void), deps: any[]) => {
    const isFirst = useRef(true)

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false
            return
        }
        return effect()
    }, deps)
}