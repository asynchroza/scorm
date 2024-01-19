import { NextResponse } from "next/server";

export async function POST(request: Request) {
    console.log(await request.json())

    return NextResponse.json({})
}