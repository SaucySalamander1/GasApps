import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // authenticate user...

  return NextResponse.json({
    success: true,
  });
}