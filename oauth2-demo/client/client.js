// OAuth2客户端配置
const config = {
  clientId: 'demo-client',
  clientSecret: 'demo-secret',
  authServer: 'http://localhost:3001',
  redirectUri: 'http://localhost:3002/callback.html',
  scope: 'profile'
};

// 存储令牌的键名
const ACCESS_TOKEN_KEY = 'oauth2_access_token';
const USER_INFO_KEY = 'oauth2_user_info';

// 开始OAuth2流程
function startOAuth() {
  // 构建授权URL
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    state: generateState()
  });

  const authUrl = `${config.authServer}/auth/login?${params.toString()}`;

  // 更新状态显示
  document.getElementById('auth-status').textContent = '正在授权...';

  // 重定向到授权服务器
  window.location.href = authUrl;
}

// 生成随机state参数防止CSRF
function generateState() {
  const state = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('oauth2_state', state);
  return state;
}

// 验证state参数
function validateState(state) {
  const storedState = sessionStorage.getItem('oauth2_state');
  sessionStorage.removeItem('oauth2_state');
  return storedState === state;
}

// 存储访问令牌
function storeAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

// 获取访问令牌
function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// 存储用户信息
function storeUserInfo(userInfo) {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
}

// 获取用户信息
function getUserInfo() {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
}

// 清除所有存储的数据
function clearAuthData() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  sessionStorage.removeItem('oauth2_state');
}

// 检查是否已登录
function isLoggedIn() {
  return !!getAccessToken();
}

// 使用授权码换取访问令牌
async function exchangeCodeForToken(code) {
  const response = await fetch(`${config.authServer}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: config.redirectUri
    })
  });

  if (!response.ok) {
    throw new Error('获取访问令牌失败');
  }

  const data = await response.json();
  return data.access_token;
}

// 使用访问令牌调用API
async function callAPI(endpoint, token) {
  const response = await fetch(`${config.authServer}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('API调用失败');
  }

  return await response.json();
}

// 显示状态消息
function showStatus(message, type = 'info') {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
  statusElement.style.display = 'block';

  // 3秒后自动隐藏
  setTimeout(() => {
    statusElement.style.display = 'none';
  }, 3000);
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    const userInfo = getUserInfo();
    document.getElementById('auth-status').textContent = `已登录 (${userInfo?.name || 'Unknown'})`;
  }
});