"use client"

import type { Course } from "@prisma/client";
import { useCallback } from "react";
import type Scorm12API from "~/app/dts/Scorm12API";
import { getClientSideCookie } from "~/lib/common-client-side-utils/cookies";

declare global {
    interface Window {
        API?: Scorm12API;
        Scorm12API: Scorm12API;
    }
}

export function ScormContainer({ selectedCourse }: { selectedCourse?: Course }) {
    if (!selectedCourse) return;

    const launchPageURL = `${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/${selectedCourse.s3Path}${selectedCourse.indexFilePath}`

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const initializeWindow = useCallback(() => {
        require('scorm-again');
        const userId = getClientSideCookie("userId");
        // const settings = window.getSec
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        window.API = new window.Scorm12API({
            lmsCommitUrl: "/api/session",
            autocommit: 5,
            alwaysSendTotalTime: true,
            selfReportSessionTime: true,
        });
        window.API.cmi.core.student_id = userId;

        window.API.on("LMSSetValue.cmi.core.lesson_status", function(_, value) {
            if (value === "success" || value === "failed") {
                console.log("Commiting results...")
            }
        });

        // window.API.on("LMSSetValue.cmi.*", function(c, v) {
        //     console.log(c, v);
        // })
    }, [])

    if (typeof window !== "undefined") {
        initializeWindow();
    }


    return <div>
        <iframe src={launchPageURL} className="w-[80vw] h-[80vh] bg-white" />
    </div>
}