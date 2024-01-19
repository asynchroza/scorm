import { NextResponse } from "next/server";
import type { LMSCommitBody } from "./types";
import { db } from "~/server/db";

const lessStatusStates = ["passed", "failed"];

function isCourseFinished(lessonStatus: string) {
    return !lessStatusStates.includes(lessonStatus)
}

async function commitSessionStatus(body: LMSCommitBody) {
    const finishStatus = isCourseFinished(body.cmi.core.lesson_status);
    const stringifiedBody = JSON.stringify(body);

    await db.session.upsert({
        where: {
            userId_courseName: {
                userId: body.cmi.core.student_id,
                courseName: body.cmi.comments
            }
        },
        update: {
            json: stringifiedBody,
            active: finishStatus,
        },
        create: {
            json: stringifiedBody,
            active: finishStatus,
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