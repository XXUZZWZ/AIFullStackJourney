# 怎么使用 React-vant List 组件四行实现无限列表

## 怎么实现呢？

把要渲染的 items 放到 <List></List> 就行了

```jsx
<List finished={finished} onLoad={onLoad}>
  {list.map((_, i) => (
    <Cell key={i} title={i + 1} />
  ))}
</List>
```

## 附带的功能

1. 自动懒加载
2. 我们只要给 List 组件传递 porps onload = {fn} 就会在滚动到底部时触发 fn
3. 还有一个 finished 属性，如果为 true ，不再继续加载
4. 下拉刷新,只要在外层套一个<guan-pull-to-refresh></guan-pull-to-refresh>并传入 props <PullRefresh onRefresh={onRefresh}> 就行了, "react-vant": "^3.3.5"里不需要引入，引入 List 就可以使用，这一点和官方文档的描述不同。
5. 此外 List 还能处理报错,只需要传递一个 props error={fn},就会在 onload 的 promise rejected 时调用 fn
6. 对于发送请求我们不需要使用防抖节流优化，List 组件自动帮我们做好这个事情。

```jsx
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react'
import { PullRefresh, List, Tabs, Cell } from 'react-vant'
import './style.less'

// 模拟异步请求
async function getData(throwError?) {
  return new Promise<number[]>((resolve, reject) => {
    setTimeout(() => {
      if (throwError) {
        reject(new Error('error'))
      }
      resolve(Array.from({ length: 10 }, (_, i) => i))
    }, 2000)
  })
}

// 基础用法
const BaseDemo = () => {
  const [list, setList] = useState<Array<number>>([])
  const [finished, setFinished] = useState<boolean>(false)

  const onLoad = async () => {
    const data = await getData()
    setList(v => [...v, ...data])
    if (list.length >= 30) {
      setFinished(true)
    }
  }
  return (
    <List finished={finished} onLoad={onLoad}>
      {list.map((_, i) => (
        <Cell key={i} title={i + 1} />
      ))}
    </List>
  )
}

// 错误提示
const ErrorDemo = () => {
  const [list, setList] = useState<Array<number>>([])
  const [finished, setFinished] = useState<boolean>(false)
  const [count, setCount] = useState(0)

  const onLoad = async () => {
    setCount(v => v + 1)
    const data = await getData(count === 1)
    setList(v => [...v, ...data])
    if (list.length >= 30) {
      setFinished(true)
    }
  }

  return (
    <List
      finished={finished}
      errorText='请求失败，点击重新加载'
      onLoad={onLoad}
    >
      {/* 若 onLoad 抛出错误，将显示错误提示，用户点击错误提示后会重新触发 onLoad 事件 */}
      {list.map((_, i) => (
        <Cell key={i} title={i + 1} />
      ))}
    </List>
  )
}

// 下拉刷新
const PullRefreshDemo = () => {
  const [list, setList] = useState<Array<number>>([])
  const [finished, setFinished] = useState<boolean>(false)

  const onLoadRefresh = async (isRefresh?) => {
    const data = await getData()
    setList(v => {
      const newList = isRefresh ? data : [...v, ...data]
      if (newList.length >= 30) {
        setFinished(true)
      }
      return newList
    })
  }

  const onRefresh = async () => {
    setFinished(false)
    await onLoadRefresh(1)
  }

  return (
    <PullRefresh onRefresh={onRefresh}>
      {/* List 组件可以与 PullRefresh 组件结合使用，实现下拉刷新的效果 */}
      <List finished={finished} onLoad={onLoadRefresh}>
        {list.map((_, i) => (
          <Cell key={i} title={i + 1} />
        ))}
      </List>
    </PullRefresh>
  )
}

export default () => (
  <div className='demo-list'>
    <Tabs sticky>
      <Tabs.TabPane title='基本用法'>
        <BaseDemo />
      </Tabs.TabPane>
      <Tabs.TabPane title='错误提示'>
        <ErrorDemo />
      </Tabs.TabPane>
      <Tabs.TabPane title='下拉刷新'>
        <PullRefreshDemo />
      </Tabs.TabPane>
    </Tabs>
  </div>
)

```
