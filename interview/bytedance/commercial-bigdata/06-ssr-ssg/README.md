# SSR vs SSG 深度解析

## 📝 面试题目

1. **SSR的原理是什么？**
2. **SSG的HTML处理过程是在哪个阶段？处理过程和SSR有什么不一样？**
3. **介绍一下水合的过程，renderToString和renderToStream两种方式下的区别？**

## 🎯 考察点

1. **渲染模式理解**：CSR、SSR、SSG的区别和应用场景
2. **性能优化**：首屏加载、SEO、用户体验
3. **水合机制**：理解客户端如何接管服务端渲染
4. **技术选型**：根据业务需求选择合适的渲染策略

## 📊 渲染模式对比

| 特性 | CSR (客户端渲染) | SSR (服务端渲染) | SSG (静态站点生成) |
|------|------------------|------------------|-------------------|
| **渲染时机** | 浏览器 | 服务器 | 构建时 |
| **首屏速度** | 慢 | 快 | 最快 |
| **SEO友好** | 差 | 好 | 最好 |
| **数据更新** | 实时 | 实时 | 需要重新构建 |
| **服务器压力** | 低 | 高 | 无 |
| **交互响应** | 一般 | 一般 | 最快 |

## 🖥️ SSR (Server-Side Rendering) 详解

### 1. SSR 原理

```javascript
// SSR 流程图
/*
Client                     Server                      CDN/API
  |                           |                           |
  | 1. 请求页面                |                           |
  |------------------------->|                           |
  |                           | 2. 获取数据               |
  |                           |------------------------->|
  |                           |                           |
  |                           | 3. 返回数据               |
  |                           |<-------------------------|
  |                           |                           |
  |                           | 4. 渲染HTML               |
  |                           |                           |
  | 5. 返回HTML+JS           |                           |
  |<-------------------------|                           |
  |                           |                           |
  | 6. 展示HTML（无交互）      |                           |
  |                           |                           |
  | 7. 加载JS，水合（Hydrate）|                           |
  |                           |                           |
  | 8. 应用可交互             |                           |
*/
```

### 2. SSR 实现示例

```javascript
// Node.js 服务端实现
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const app = express();
const port = 3000;

app.get('*', async (req, res) => {
  try {
    // 1. 获取数据
    const data = await fetchData(req.url);

    // 2. 创建组件实例
    const appHtml = renderToString(<App data={data} url={req.url} />);

    // 3. 注入到HTML模板
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR App</title>
        </head>
        <body>
          <div id="root">${appHtml}</div>
          <script>
            // 注入初始数据
            window.__INITIAL_DATA__ = ${JSON.stringify(data)};
          </script>
          <script src="/client.js"></script>
        </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`SSR Server running on port ${port}`);
});

// 获取数据函数
async function fetchData(url) {
  // 根据URL获取相应数据
  // 实际项目中会调用API或查询数据库
  return {
    user: { name: 'John', id: 1 },
    posts: [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' }
    ]
  };
}
```

### 3. renderToString vs renderToStream

#### renderToString - 同步渲染

```javascript
import { renderToString } from 'react-dom/server';

function handleRequest(req, res) {
  // 同步渲染，等待整个HTML生成
  const html = renderToString(<App />);

  // 一次性发送完整HTML
  res.send(html);
}

// 特点：
// - 简单易用
// - 需要等待所有内容渲染完成
// - 内存占用较高（整个HTML在内存中）
// - 不适合大页面
```

#### renderToStream - 流式渲染

```javascript
import { renderToPipeableStream } from 'react-dom/server';

function handleRequest(req, res) {
  const { pipe } = renderToPipeableStream(
    <App />,
    {
      bootstrapScripts: ['/client.js'],
      onShellReady() {
        // Shell准备好，开始流式传输
        res.setHeader('Content-Type', 'text/html');
        pipe(res);
      },
      onShellError(error) {
        // 错误处理
        res.status(500).send('Error');
      },
      onAllReady() {
        // 所有内容都准备好（可选）
      },
      onError(err) {
        // 流式传输中的错误
        console.error(err);
      }
    }
  );
}

// 特点：
// - 渐进式渲染，首屏更快
// - 内存占用低
// - 支持Suspense和异步组件
// - 更好的用户体验（逐步显示内容）
```

## 🏗️ SSG (Static Site Generation) 详解

### 1. SSG 原理

```javascript
// 构建时流程
/*
Build Time                    Runtime
  |                            |
  | 1. 读取所有页面/组件         |
  |                            |
  | 2. 预渲染HTML              |
  |                            |
  | 3. 生成静态文件             |
  |                            |
  | 4. 部署到CDN               |
  |--------------------------->|
  |                            |
  | 5. 用户直接访问静态文件     |
  |<---------------------------|
*/
```

### 2. SSG 实现示例 (Next.js)

```javascript
// pages/index.js
export async function getStaticProps() {
  // 构建时获取数据
  const posts = await fetch('https://api.example.com/posts');

  return {
    props: {
      posts: await posts.json(),
    },
    revalidate: 60, // ISR: 60秒后重新生成
  };
}

export async function getStaticPaths() {
  // 动态路由的静态生成
  const posts = await fetch('https://api.example.com/posts');
  const paths = await posts.json().map(post => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: false, // 或 'blocking' 或 true
  };
}

function HomePage({ posts }) {
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

export default HomePage;
```

### 3. ISR (Incremental Static Regeneration)

```javascript
// 增量静态再生成
export async function getStaticProps() {
  // 获取最新数据
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();

  return {
    props: { data },
    revalidate: 60, // 60秒后自动重新生成页面
    notFound: false,
  };
}

// 特点：
// - 结合了SSG的性能和SSR的实时性
// - 后台自动更新静态页面
// - 用户始终访问到静态页面
// - 适合内容更新频繁的场景
```

## 💧 水合（Hydration）详解

### 1. 水合过程

```javascript
// 客户端水合流程
/*
1. 浏览器接收服务端HTML
2. 显示静态内容（无交互）
3. 下载并执行JavaScript
4. React组件初始化
5. 对比Virtual DOM和真实DOM
6. 添加事件监听器
7. 应用变成可交互
*/

import { hydrateRoot } from 'react-dom/client';
import App from './App';

// 获取服务端注入的数据
const initialData = window.__INITIAL_DATA__;

// 水合：将静态HTML转换为可交互的React应用
const container = document.getElementById('root');
const root = hydrateRoot(
  container,
  <App data={initialData} />
);
```

### 2. 水合注意事项

```javascript
// ❌ 问题：服务端和客户端内容不匹配
function DateTime() {
  const date = new Date().toString(); // 每次渲染都不同

  return <div>{date}</div>;
}

// ✅ 解决方案1：统一时间
function DateTime() {
  const [date, setDate] = useState(null);

  useEffect(() => {
    setDate(new Date().toString());
  }, []);

  return <div>{date || 'Loading...'}</div>;
}

// ✅ 解决方案2：使用SSR专有API
import { useEffect, useState } from 'react';

function DateTime() {
  const [date, setDate] = useState(() => {
    // 服务端：使用固定值
    if (typeof window === 'undefined') {
      return 'Loading...';
    }
    // 客户端：使用实际时间
    return new Date().toString();
  });

  return <div>{date}</div>;
}
```

### 3. 优化的水合策略

```javascript
// 选择性水合
import { lazy, Suspense } from 'react';

// 延迟加载非关键组件
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <Header /> {/* 立即水合 */}
      <MainContent /> {/* 立即水合 */}

      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent /> {/* 延迟加载和hydrating */}
      </Suspense>
    </div>
  );
}

// 流式SSR + Suspense
function Post({ id }) {
  return (
    <div>
      <PostHeader id={id} /> {/* 立即渲染 */}

      <Suspense fallback={<PostCommentsSkeleton />}>
        <PostComments id={id} /> {/* 数据获取完成后流式渲染 */}
      </Suspense>
    </div>
  );
}
```

## 🎯 应用场景选择

### 1. CSR 适用场景

```javascript
// 管理后台、dashboard等
// - SEO不重要
// - 需要复杂交互
// - 用户已登录

function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <div>
      <Sidebar />
      <Charts data={data} />
      <DataTable data={data} />
    </div>
  );
}
```

### 2. SSR 适用场景

```javascript
// 电商、新闻、社交平台
// - SEO重要
// - 内容个性化
// - 需要实时数据

// Next.js SSR示例
export async function getServerSideProps(context) {
  // 每次请求都执行
  const userId = context.req.cookies.userId;
  const user = await getUser(userId);
  const products = await getProducts(user.preferences);

  return {
    props: {
      user,
      products,
    },
  };
}
```

### 3. SSG 适用场景

```javascript
// 博客、文档、营销页面
// - 内容固定或定期更新
// - 极致的性能要求
// - SEO最重要

// Gatsby SSG示例
export const query = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            date
          }
          html
        }
      }
    }
  }
`;

function BlogPost({ data }) {
  return (
    <Layout>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <article key={node.frontmatter.title}>
          <h1>{node.frontmatter.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: node.html }} />
        </article>
      ))}
    </Layout>
  );
}
```

## 🚀 性能优化技巧

### 1. SSR优化

```javascript
// 1. 缓存策略
import LRU from 'lru-cache';

const ssrCache = new LRU({
  max: 100,
  ttl: 1000 * 60 * 5, // 5分钟缓存
});

function getCachedHTML(url) {
  const cached = ssrCache.get(url);
  if (cached) return cached;

  const html = renderToString(<App url={url} />);
  ssrCache.set(url, html);
  return html;
}

// 2. 流式渲染
function handleRequest(req, res) {
  // 先发送shell
  res.write('<!DOCTYPE html><html><head>...</head><body>');

  // 流式内容
  const stream = renderToStream(<App />);
  stream.pipe(res, { end: false });

  stream.on('end', () => {
    res.end('</body></html>');
  });
}

// 3. 代码分割
import { loadable } from '@loadable/component';

const HeavyComponent = loadable(() => import('./HeavyComponent'), {
  ssr: false, // 跳过SSR，客户端加载
});
```

### 2. 混合渲染策略

```javascript
// 根据页面特性选择渲染方式
function App() {
  return (
    <Router>
      <Route path="/" exact>
        {/* 首页：SSG */}
        <HomePage />
      </Route>

      <Route path="/blog/:id">
        {/* 博客详情：SSR */}
        <BlogPostPage />
      </Route>

      <Route path="/admin">
        {/* 管理后台：CSR */}
        <AdminPage />
      </Route>

      <Route path="/user/:id">
        {/* 用户页：ISR */}
        <UserProfilePage />
      </Route>
    </Router>
  );
}
```

## 🎯 面试回答模板

```
SSR、SSG和CSR是三种不同的渲染策略，各有优缺点：

**SSR（服务端渲染）**：
- 在服务器上渲染HTML，直接返回给浏览器
- 优点：首屏快、SEO友好
- 缺点：服务器压力大、TTFB（首字节时间）较长
- 适合：内容需要个性化、SEO要求高的场景

**SSG（静态站点生成）**：
- 在构建时预渲染所有页面为静态HTML
- 优点：性能最好、SEO完美、无服务器压力
- 缺点：构建时间长、内容更新需要重新构建
- 适合：内容相对固定的网站，如博客、文档

**水合（Hydration）**：
是SSR的关键步骤，指客户端JavaScript接管服务端渲染的静态HTML，使其变得可交互的过程。

renderToString和renderToStream的区别：
- renderToString：同步渲染整个页面，返回完整HTML
- renderToStream：流式渲染，边渲染边发送，首屏更快

选择建议：
- 如果SEO和首屏速度是关键，选择SSR
- 如果内容相对固定且追求极致性能，选择SSG
- 如果是复杂的应用且SEO不重要，可以选择CSR
- 也可以混合使用，根据页面特性选择合适的方式
```

## 📚 进阶学习

1. **Edge Computing**：边缘渲染
2. **Distributed Rendering**：分布式渲染
3. **Progressive Enhancement**：渐进增强
4. **Web Vitals**：性能指标优化

---

**选择合适的渲染策略，是Web性能优化的关键！** 🚀