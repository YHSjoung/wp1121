import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  try {
    console.log(req.nextUrl.pathname);
    if (!req.headers.get("authorization")) {
      return new NextResponse(
        JSON.stringify({ errorMessage: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({ errorMessage: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    // const verified = jwt.verify(token, env.NEXT_PUBLIC_JWT_SECRET!);
    // console.log("verified", verified);
    // const user = (verified as { user: User}).user;
    // console.log(user)
    // req.user = user;
    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ errorMessage: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export const config = {
  matcher: ["/api/chatRooms/:path*", "/api/chats"],
};
