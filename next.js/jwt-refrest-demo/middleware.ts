import { NextRequest,NextResponse } from "next/server";


const protectedRoutes = ['/dashboard','/profile'];
// pre  ----> middleware  ----> next
export async function middleware(request: NextRequest) {
  // console.log('middleware必须过一下我这');
  const pathname = request.nextUrl.pathname;
  if(!protectedRoutes.some(route => pathname.startsWith(route))){
    return NextResponse.next();
  }
  
   return Response.redirect(new URL('/login',request.url))
}