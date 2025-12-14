// 从URL参数中获取授权码和state
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');
const error = urlParams.get('error');

// 引入client.js中的函数（在实际项目中应该使用模块化）
// 这里我们直接重新定义必要的函数
const config = {
  clientId: 'demo-client',
  clientSecret: 'demo-secret',
  authServer: 'http://localhost:3001',
  redirectUri: 'http://localhost:3002/callback.html'
};

// 处理回调
document.addEventListener('DOMContentLoaded', async () => {
  if (error) {
    showError(`授权失败: ${error}`);
    return;
  }

  if (!code) {
    showError('未收到授权码');
    return;
  }

  try {
    // 显示授权码
    updateStep(1, 'completed', '接收到授权码');
    document.getElementById('auth-code-display').innerHTML = `
      <div class="code-block">
        <strong>Authorization Code:</strong> ${code}
      </div>
      <p style="margin-top: 10px; color: #666;">
        <strong>State:</strong> ${state || '(未提供)'}
      </p>
    `;

    // 步骤2: 交换访问令牌
    updateStep(2, 'processing', '正在交换访问令牌...');
    const accessToken = await exchangeCodeForToken(code);

    updateStep(2, 'completed', '成功获取访问令牌');
    document.getElementById('token-exchange-display').innerHTML = `
      <div class="code-block">
        <strong>Access Token:</strong><br>
        ${accessToken.substring(0, 50)}...
      </div>
      <p style="margin-top: 10px; color: #28a745;">✓ 令牌获取成功</p>
    `;

    // 存储令牌
    localStorage.setItem('oauth2_access_token', accessToken);

    // 步骤3: 获取用户信息
    updateStep(3, 'processing', '正在获取用户信息...');
    const userInfo = await getUserInfo(accessToken);

    updateStep(3, 'completed', '成功获取用户信息');
    document.getElementById('userinfo-display').innerHTML = `
      <div class="code-block">
        <strong>用户ID:</strong> ${userInfo.id}<br>
        <strong>姓名:</strong> ${userInfo.name}<br>
        <strong>邮箱:</strong> ${userInfo.email}<br>
        <strong>权限:</strong> ${userInfo.scope}
      </div>
    `;

    // 存储用户信息
    localStorage.setItem('oauth2_user_info', JSON.stringify(userInfo));

    // 隐藏加载器，显示成功按钮
    document.getElementById('loader').style.display = 'none';
    document.getElementById('success-actions').style.display = 'block';

    // 3秒后自动跳转到dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 3000);

  } catch (err) {
    console.error('OAuth2回调处理失败:', err);
    showError(`处理失败: ${err.message}`);
  }
});

// 更新步骤状态
function updateStep(stepNumber, status, text) {
  const step = document.getElementById(`step${stepNumber}`);
  const icon = step.querySelector('.step-icon');
  const title = step.querySelector('h3');

  // 更新步骤类
  step.className = `step ${status}`;

  // 更新图标
  icon.className = `step-icon ${status}`;
  if (status === 'completed') {
    icon.innerHTML = '✓';
  } else if (status === 'processing') {
    icon.innerHTML = stepNumber;
  }

  // 更新文本
  if (text) {
    title.innerHTML = `
      <span class="step-icon ${status}">${status === 'completed' ? '✓' : stepNumber}</span>
      ${text}
    `;
  }
}

// 显示错误
function showError(message) {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('error-display').style.display = 'block';
  document.getElementById('error-message').textContent = message;

  // 隐藏所有步骤
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`step${i}`).style.display = 'none';
  }
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
    const errorData = await response.json();
    throw new Error(errorData.error || '获取访问令牌失败');
  }

  const data = await response.json();
  return data.access_token;
}

// 获取用户信息
async function getUserInfo(accessToken) {
  const response = await fetch(`${config.authServer}/api/userinfo`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '获取用户信息失败');
  }

  return await response.json();
}