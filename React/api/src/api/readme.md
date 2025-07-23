# 前端接口联调必修：Axios 深度指南

## 1. 架构设计与实现原理

### 1.1 分层架构优势
- **配置层(config.js)**：集中管理所有HTTP请求配置
  - 统一baseURL设置
  - 全局超时配置
  - 拦截器管理
- **业务层(index.js)**：按功能模块组织API
  - 语义化的方法命名
  - 参数预处理
  - 响应数据格式化

### 1.2 完整配置示例
```js
// config.js
import axios from "axios";
import { message } from "antd";

// 环境判断
const isDev = process.env.NODE_ENV === 'development';

// 基础配置
const service = axios.create({
  baseURL: isDev ? '/api' : 'https://prod.example.com',
  timeout: 30000,
  withCredentials: true
});

// 请求拦截
service.interceptors.request.use(config => {
  // 添加认证token
  if (localStorage.token) {
    config.headers.Authorization = `Bearer ${localStorage.token}`;
  }
  
  // 开发环境打印日志
  if (isDev) {
    console.log('[Request]', config.method.toUpperCase(), config.url);
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截
service.interceptors.response.use(
  response => {
    // 统一处理业务错误码
    if (response.data.code !== 200) {
      return Promise.reject(response.data);
    }
    return response.data;
  },
  error => {
    // 网络错误处理
    if (!error.response) {
      message.error('网络异常，请检查网络连接');
    }
    
    // HTTP状态码处理
    switch (error.response.status) {
      case 401:
        router.replace('/login');
        break;
      case 403:
        message.error('没有操作权限');
        break;
      case 500:
        message.error('服务器内部错误');
        break;
      default:
        message.error(error.response.data.message || '请求失败');
    }
    
    return Promise.reject(error);
  }
);

export default service;
```

```js
// config.js - 统一配置层
import axios from "axios";

// 基础配置
axios.defaults.baseURL = "https://api.github.com";
axios.defaults.timeout = 10000;

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.token}`;
  return config;
});

export default axios;
```

```js
// index.js - 业务接口层
import axios from "./config";

export const api = {
  getRepos: (username) => axios.get(`/users/${username}/repos`),
  getUser: (username) => axios.get(`/users/${username}`)
};
```

## 2. 高级功能详解

### 2.1 拦截器深度应用
#### 请求拦截场景：
1. 添加全局Loading效果
```js
let loadingCount = 0;
const showLoading = () => {
  if (loadingCount++ === 0) {
    Spin.show();
  }
};
const hideLoading = () => {
  if (--loadingCount === 0) {
    Spin.hide();
  }
};

service.interceptors.request.use(config => {
  if (config.showLoading !== false) {
    showLoading();
  }
  return config;
});

service.interceptors.response.use(
  response => {
    hideLoading();
    return response;
  },
  error => {
    hideLoading();
    return Promise.reject(error);
  }
);
```

2. 接口耗时统计
```js
service.interceptors.request.use(config => {
  config.metadata = { startTime: Date.now() };
  return config;
});

service.interceptors.response.use(response => {
  const duration = Date.now() - response.config.metadata.startTime;
  console.log(`请求耗时: ${duration}ms`);
  return response;
});
```

### 2.2 取消请求进阶方案
1. 自动取消重复请求
```js
const pendingRequests = new Map();

service.interceptors.request.use(config => {
  const requestKey = `${config.method}-${config.url}`;
  
  if (pendingRequests.has(requestKey)) {
    pendingRequests.get(requestKey).abort();
  }
  
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(requestKey, controller);
  
  return config;
});

service.interceptors.response.use(response => {
  const requestKey = `${response.config.method}-${response.config.url}`;
  pendingRequests.delete(requestKey);
  return response;
});
```

2. 页面跳转自动取消
```js
// 在路由守卫中
router.beforeEach((to, from, next) => {
  pendingRequests.forEach(controller => controller.abort());
  pendingRequests.clear();
  next();
});
```

### 2.1 环境切换配置
```js
// 根据环境变量切换baseURL
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://prod.api.com' 
  : 'https://dev.api.com';
```

### 2.2 拦截器实战
```js
// 响应拦截器 - 统一错误处理
axios.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response.status === 401) {
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
```

### 2.3 取消请求
```js
const controller = new AbortController();

axios.get('/api', {
  signal: controller.signal
});

// 需要时取消请求
controller.abort();
```

### 2.4 文件上传
```js
const formData = new FormData();
formData.append('file', file);

axios.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### 2.5 并发请求
```js
Promise.all([
  axios.get('/api/users'),
  axios.get('/api/posts')
]).then(([users, posts]) => {
  // 处理结果
});
```

## 3. 工程化实践

### 3.1 模块化组织方案
```bash
api/
├── config.js       # 全局配置
├── modules/        # 业务模块
│   ├── user.js     # 用户相关接口
│   ├── product.js  # 产品相关接口
│   └── order.js    # 订单相关接口
├── constants.js    # 状态码常量
├── utils.js        # 工具函数
└── index.js        # 统一导出
```

### 3.2 类型安全方案(TypeScript)
```ts
// 响应数据类型定义
interface BaseResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}

// 分页数据类型
interface Pagination<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

// API方法定义
export function getUserList(
  params: { page: number; size: number }
): Promise<BaseResponse<Pagination<User>>> {
  return service.get('/user/list', { params });
}
```

### 3.3 自动化Mock方案
```js
// 使用vite-plugin-mock
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      localEnabled: true,
      prodEnabled: false,
      injectCode: `
        import { setupProdMockServer } from '../mock';
        setupProdMockServer();
      `
    })
  ]
});
```

1. **目录结构规范**：
   ```
   /api
   ├── config.js    # Axios全局配置
   ├── modules/     # 按业务模块拆分
   │   ├── user.js
   │   └── product.js
   └── index.js     # 统一出口
   ```

2. **TypeScript支持**：
```ts
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export function getUsers(): Promise<ApiResponse<User[]>> {
  return axios.get('/users');
}
```

3. **Mock方案**：
```js
// 开发环境使用Mock.js
if (process.env.NODE_ENV === 'development') {
  require('./mock');
}
```

## 4. 疑难问题深度解析

### 4.1 大文件上传解决方案
1. 分片上传实现
```js
async function uploadFile(file) {
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const chunks = Math.ceil(file.size / chunkSize);
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunk = file.slice(start, end);
    
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('chunkIndex', i);
    formData.append('totalChunks', chunks);
    formData.append('fileId', file.name + file.size);
    
    await service.post('/upload/chunk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  
  // 合并请求
  await service.post('/upload/merge', {
    fileName: file.name,
    totalChunks: chunks
  });
}
```

2. 断点续传实现
```js
// 检查已上传分片
async function checkUploadedChunks(file) {
  const res = await service.get('/upload/progress', {
    params: { fileId: file.name + file.size }
  });
  return res.data.uploadedChunks || [];
}

// 上传时跳过已传分片
const uploadedChunks = await checkUploadedChunks(file);
for (let i = 0; i < chunks; i++) {
  if (uploadedChunks.includes(i)) continue;
  // 上传逻辑...
}
```

1. **跨域问题**：
   - 配置代理（vite.config.js）
   ```js
   server: {
     proxy: {
       '/api': {
         target: 'http://backend:3000',
         changeOrigin: true
       }
     }
   }
   ```

2. **重复请求**：
   ```js
   // 使用axios-extensions的cacheAdapter
   import { cacheAdapterEnhancer } from 'axios-extensions';
   
   const axios = createAxios({
     adapter: cacheAdapterEnhancer(axios.defaults.adapter)
   });
   ```

3. **文件下载**：
   ```js
   axios.get('/export', {
     responseType: 'blob'
   }).then(res => {
     const url = URL.createObjectURL(res.data);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'report.xlsx';
     a.click();
   });
   ```

## 5. 性能优化与监控

### 5.1 请求优化策略
1. 请求缓存实现
```js
const cache = new Map();

service.interceptors.request.use(config => {
  if (config.cache) {
    const cacheKey = JSON.stringify(config);
    if (cache.has(cacheKey)) {
      return Promise.resolve(cache.get(cacheKey));
    }
  }
  return config;
});

service.interceptors.response.use(response => {
  if (response.config.cache) {
    const cacheKey = JSON.stringify(response.config);
    cache.set(cacheKey, response);
  }
  return response;
});
```

2. 请求合并方案
```js
let pendingRequests = {};

function batchRequest(url, params) {
  const requestKey = JSON.stringify({ url, params });
  
  if (!pendingRequests[requestKey]) {
    pendingRequests[requestKey] = new Promise(resolve => {
      setTimeout(() => {
        service.get(url, { params }).then(resolve);
        delete pendingRequests[requestKey];
      }, 50); // 50ms内相同请求合并
    });
  }
  
  return pendingRequests[requestKey];
}
```

### 5.2 性能监控方案
```js
// 性能数据收集
const metrics = {
  totalRequests: 0,
  successRequests: 0,
  failedRequests: 0,
  totalTime: 0
};

service.interceptors.request.use(config => {
  config.metadata = { startTime: Date.now() };
  metrics.totalRequests++;
  return config;
});

service.interceptors.response.use(
  response => {
    const duration = Date.now() - response.config.metadata.startTime;
    metrics.totalTime += duration;
    metrics.successRequests++;
    return response;
  },
  error => {
    metrics.failedRequests++;
    return Promise.reject(error);
  }
);

// 定时上报性能数据
setInterval(() => {
  if (metrics.totalRequests > 0) {
    const avgTime = metrics.totalTime / metrics.successRequests;
    trackApiPerformance({
      ...metrics,
      avgTime,
      successRate: metrics.successRequests / metrics.totalRequests
    });
    // 重置计数
    metrics.totalRequests = 0;
    metrics.successRequests = 0;
    metrics.failedRequests = 0;
    metrics.totalTime = 0;
  }
}, 60000);
```

1. 合理设置缓存策略
2. 使用HTTP/2多路复用
3. 压缩请求数据
4. 开启keep-alive
