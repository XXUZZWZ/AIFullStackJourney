#!/bin/bash

echo "========================================"
echo "   OAuth2授权码流程演示"
echo "========================================"
echo

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到Node.js"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
fi

echo
echo "启动授权服务器 (端口 3001)..."
node server.js &
AUTH_PID=$!

echo
echo "启动客户端应用 (端口 3000)..."
node client-server.js &
CLIENT_PID=$!

echo
echo "========================================"
echo "服务器已启动!"
echo "========================================"
echo "授权服务器: http://localhost:3001"
echo "客户端应用: http://localhost:3000"
echo
echo "测试账号:"
echo "  - 用户名: admin, 密码: password123"
echo "  - 用户名: user1, 密码: 123456"
echo
echo "按 Ctrl+C 停止所有服务"
echo

# 等待用户中断
trap "echo; echo 正在停止服务...; kill $AUTH_PID $CLIENT_PID 2>/dev/null; echo 服务已停止" INT
wait