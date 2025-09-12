import {
  SignJWT,
  jwtVerify
} from 'jose'

import {
  cookies
} from 'next/headers'

const getSecretKey = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 环境变量未设置');
  }
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export const createToken = async (userId: string) => {
  const accessToken = await new SignJWT({ userId }) // payload  为 userId
    .setProtectedHeader({ alg: 'HS256' }) // 使用HS256算法 签名
    .setIssuedAt() // 设置签发时间 默认当前时间
    .setExpirationTime('15m') // 设置过期时间 15m
    .sign(getSecretKey()) // 签名
  const refreshToken = await new SignJWT({ userId }) // payload  为 userId
    .setProtectedHeader({ alg: 'HS256' }) // 使用HS256算法 签名
    .setIssuedAt() // 设置签发时间 默认当前时间
    .setExpirationTime('7d') // 设置过期时间 7d
    .sign(getSecretKey()) // 签名
  return {
    accessToken,
    refreshToken
  }
}

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (error) {
    console.error('verifyToken error:', error);
    return null;
  }
}

export const setAuthCookies = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies()
  cookieStore.set('access_token', accessToken, {
    // 避免xss 攻击
    httpOnly: true,
    maxAge: 60 * 15,
    sameSite: 'strict',
    path: '/'
  })
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7天
    sameSite: 'strict',
    path: '/'
  })

} 