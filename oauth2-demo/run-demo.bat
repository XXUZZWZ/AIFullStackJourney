@echo off
color 0A
echo.
echo ============================================
echo        OAuth2 授权码流程演示
echo ============================================
echo.
echo 正在启动服务，请稍候...
echo.

:: 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b
)

:: 安装依赖
if not exist node_modules (
    echo [信息] 正在安装依赖包...
    npm install >nul
)

:: 启动授权服务器
echo [信息] 启动授权服务器 (端口 3001)...
start "Auth Server" cmd /c "title OAuth2 授权服务器 && node server.js && pause"

:: 等待一下让授权服务器先启动
timeout /t 2 >nul

:: 启动客户端服务器
echo [信息] 启动客户端应用 (端口 3002)...
start "Client App" cmd /c "title OAuth2 客户端 && node client-server.js && pause"

echo.
echo ============================================
echo 服务器已成功启动！
echo ============================================
echo.
echo 授权服务器: http://localhost:3001
echo 客户端应用: http://localhost:3002
echo.
echo 测试账号:
echo   - 用户名: admin  密码: password123
echo   - 用户名: user1  密码: 123456
echo.
echo [提示] 浏览器将自动打开客户端页面...
echo.

:: 等待2秒后打开浏览器
timeout /t 2 >nul
start http://localhost:3002

echo.
echo 按任意键关闭所有服务...
pause >nul

:: 关闭所有Node进程
taskkill /F /IM node.exe 2>nul
echo.
echo [信息] 所有服务已关闭，再见！
timeout /t 2 >nul