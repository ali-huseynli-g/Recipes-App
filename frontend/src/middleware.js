import { NextResponse } from "next/server";

export default async function middleware(req) {
  console.log("Hello From Middleware");
  const response = NextResponse.next();

  return response;
}
