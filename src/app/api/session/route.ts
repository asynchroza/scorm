import { type NextRequest, NextResponse } from "next/server";
import type { LMSCommitBody } from "./types";
import { db } from "~/server/db";
import { LESSON_STATUS_FLAGS } from "./constants";

function isCourseFinished(lessonStatus: string) {
    return !LESSON_STATUS_FLAGS.includes(lessonStatus)
}

async function commitSessionStatus(body: LMSCommitBody) {
    if (body.cmi.core.student_id === "" || body.cmi.comments === "") return;

    const finishStatus = isCourseFinished(body.cmi.core.lesson_status);
    const stringifiedBody = JSON.stringify(body);

    return await db.session.upsert({
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
                connect: {
                    id: body.cmi.core.student_id
                }
            }
        }
    })
}

async function getSession(userId: string, courseName: string) {

    return await db.session.findUnique({
        where: {
            userId_courseName: {
                userId,
                courseName,
            },
            active: true
        },
        select: {
            json: true
        }
    })
}

export async function POST(request: Request) {
    const body = await request.json() as LMSCommitBody;
    const transaction = await commitSessionStatus(body);

    if (!transaction) {
        // ! this case should be explicitly handled as the LMS makes a commit on initial load before old session is fully loaded
        return NextResponse.json({ "error": "Either cmi.core.student_id or cmi.comments is an empty string" }, { status: 400 })
    }

    return NextResponse.json({})
}

export async function GET(request: NextRequest) {
    // !: UrlSearchParams bugs out when the url is passed directly into the constructor
    const query = new URL(request.url).searchParams;
    const userId = query.get('userId')
    const courseName = query.get('courseName')

    if (!userId || !courseName) return NextResponse.json({ error: "Missing query params" }, { status: 400 });
    const session = await getSession(userId, courseName);

    if (!session) {
        return NextResponse.json({ error: "Session wasn't found" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(session.json));
}