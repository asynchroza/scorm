import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "~/server/db";

async function createUserIfNotExistent(userId: string) {
    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        await db.user.create({
            data: {
                id: userId,
            },
        });
    }

    return user;
}

export async function GET(request: Request) {
    const cookie = request.headers.get('Cookie') as string | undefined;

    if (!cookie) {
        const userId = Math.floor(Math.random() * 1000).toString()
        cookies().set('userId', userId)
    }

    const user = await createUserIfNotExistent(cookies().get('userId')!.value);
    return NextResponse.json(user);
}