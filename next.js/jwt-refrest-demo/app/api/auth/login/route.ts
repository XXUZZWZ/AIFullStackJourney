import {
  NextResponse,
  NextRequest
} from "next/server";
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from '@/lib/jwt';
import { prisma } from "@/lib/db";
import { emailRegex, passwordRegex } from '@/lib/regexp';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    const { accessToken, refreshToken } = createToken(user.id.toString());
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken }
    })
    return NextResponse.json({ message: 'Login successful', accessToken, refreshToken }, { status: 200 })

  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}