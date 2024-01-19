import { NextResponse } from "next/server";
import type { LMSCommitBody } from "./types";
import { db } from "~/server/db";

async function commitSessionStatus(body: LMSCommitBody) {
    await db.session.upsert({
        where: {
            userId_courseName: {
                userId: body.cmi.core.student_id,
                courseName: body.cmi.comments
            }
        },
        update: {
            json: JSON.stringify(body),
            active: !["success", "failed"].includes(body.cmi.core.lesson_status),
        },
        create: {
            json: JSON.stringify(body),
            active: !["success", "failed"].includes(body.cmi.core.lesson_status),
            courseName: body.cmi.comments,
            User: {
                connectOrCreate: {
                    where: {
                        id: body.cmi.core.student_id
                    },
                    create: {
                        id: body.cmi.core.student_id,
                    }
                }
            }
        }
    })
}

export async function POST(request: Request) {
    const body = await request.json() as LMSCommitBody;
    await commitSessionStatus(body);

    return NextResponse.json({})
}