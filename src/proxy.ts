import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedin = !!req.auth;
    const pathname = req.nextUrl.pathname;
    

    if( (pathname.startsWith("/login") || pathname.startsWith("/signup")) && isLoggedin ){
        return NextResponse.redirect( new URL ("/dashboard", req.url));
    }

    if( (pathname.startsWith("/dashboard/admin") && req.auth?.user?.role !== "ADMIN")){
        return NextResponse.redirect( new URL ("/dashboard", req.url));
    }

})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
