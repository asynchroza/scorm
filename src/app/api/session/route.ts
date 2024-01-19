import { NextResponse } from "next/server";
import type { LMSCommitBody } from "./types";
import { db } from "~/server/db";

async function commitSessionStatus(body: LMSCommitBody, isActive: boolean) {
    await db.session.upsert({
        where: {
            userId: body.cmi.core.student_id
        },
        update: {
            json: JSON.stringify(body),
            active: isActive,
        }
    })
}

export async function POST(request: Request) {
    const body = await request.json() as LMSCommitBody;
    console.log(body);

    return NextResponse.json({})
}