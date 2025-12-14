@echo off
title OAuth2 Demo Server

echo ========================================
echo    OAuth2授权码流程演示
echo ========================================
echo.

:: 检查是否安装了Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查是否安装了依赖
if not exist node_modules (
    echo 正在安装依赖...
    npm install
)

echo.
echo 启动授权服务器 (端口 3001)...
start "OAuth2 Auth Server" cmd /k "node server.js"

echo.
echo 启动客户端应用 (端口 3000)...
start "OAuth2 Client" cmd /k "node client-server.js"

echo.
echo ========================================
echo 服务器已启动!
echo ========================================
echo 授权服务器: http://localhost:3001
echo 客户端应用: http://localhost:3000
echo.
echo 测试账号:
echo  - 用户名: admin, 密码: password123
echo  - 用户名: user1, 密码: 123456
echo.
echo 按任意键退出...
pause >nul

:: 关闭所有node进程
taskkill /F /IM node.exe 2>nul
echo 已关闭所有服务