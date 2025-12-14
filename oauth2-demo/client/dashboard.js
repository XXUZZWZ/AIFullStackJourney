// 页面加载时显示用户信息
document.addEventListener('DOMContentLoaded', async () => {
  const accessToken = localStorage.getItem('oauth2_access_token');
  const userInfo = localStorage.getItem('oauth2_user_info');

  if (!accessToken) {
    // 未登录，重定向到首页
    window.location.href = 'index.html';
    return;
  }

  if (userInfo) {
    const user = JSON.parse(userInfo);
    displayUserInfo(user);
  }

  // 显示部分访问令牌
  const tokenElement = document.getElementById('access-token');
  if (tokenElement && accessToken.length > 50) {
    tokenElement.textContent = accessToken.substring(0, 50) + '...';
  }
});

// 显示用户信息
function displayUserInfo(user) {
  document.getElementById('user-id').textContent = user.id;
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-scope').textContent = user.scope;

  // 设置头像（使用用户名的首字母）
  const avatar = document.getElementById('avatar');
  if (avatar && user.name) {
    avatar.textContent = user.name.charAt(0).toUpperCase();
  }
}

// 刷新用户信息
async function refreshUserInfo() {
  const accessToken = localStorage.getItem('oauth2_access_token');
  if (!accessToken) {
    showAPIResponse('未找到访问令牌', 'error');
    return;
  }

  try {
    showAPIResponse('正在刷新用户信息...', 'info');

    const response = await fetch('http://localhost:3001/api/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('API调用失败');
    }

    const userInfo = await response.json();

    // 更新显示
    displayUserInfo(userInfo);

    // 更新存储
    localStorage.setItem('oauth2_user_info', JSON.stringify(userInfo));

    showAPIResponse('用户信息刷新成功！\n\n' + JSON.stringify(userInfo, null, 2), 'success');

  } catch (error) {
    showAPIResponse(`刷新失败: ${error.message}`, 'error');
  }
}

// 测试受保护的API
async function testAPI() {
  const accessToken = localStorage.getItem('oauth2_access_token');
  if (!accessToken) {
    showAPIResponse('未找到访问令牌', 'error');
    return;
  }

  try {
    showAPIResponse('正在测试API访问...', 'info');

    // 测试获取当前时间（模拟受保护资源）
    const response = await fetch('http://localhost:3001/api/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    showAPIResponse('API调用成功！\n\n响应数据:\n' + JSON.stringify(data, null, 2), 'success');

  } catch (error) {
    showAPIResponse(`API测试失败: ${error.message}`, 'error');
  }
}

// 显示API响应
function showAPIResponse(message, type) {
  const responseElement = document.getElementById('api-response');
  responseElement.style.display = 'block';
  responseElement.textContent = message;

  // 根据类型设置样式
  responseElement.style.background = type === 'error' ? '#f8d7da' :
                                   type === 'info' ? '#d1ecf1' :
                                   '#d4edda';
  responseElement.style.color = type === 'error' ? '#721c24' :
                                type === 'info' ? '#0c5460' :
                                '#155724';
  responseElement.style.border = `1px solid ${type === 'error' ? '#f5c6cb' :
                                           type === 'info' ? '#bee5eb' :
                                           '#c3e6cb'}`;
}

// 格式化JSON显示
function formatJSON(obj) {
  return JSON.stringify(obj, null, 2);
}