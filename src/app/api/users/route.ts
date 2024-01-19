import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const cookie = request.headers.get('Cookie') as string | undefined;

    if (!cookie) {
        cookies().set('userId', Math.floor(Math.random() * 1000).toString())
    }

    return NextResponse.json({})
}