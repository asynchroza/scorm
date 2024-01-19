import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "~/server/db";

async function createUserIfNotExistent(userId: string) {
    await db.user.create({
        data: {
            id: userId,
        },
    });
}

export async function GET(request: Request) {
    const cookie = request.headers.get('Cookie') as string | undefined;

    if (!cookie) {
        const userId = Math.floor(Math.random() * 1000).toString()
        await createUserIfNotExistent(userId);
        cookies().set('userId', userId)
    }

    return NextResponse.json({})
}