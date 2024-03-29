"use client"

import type { Course } from "@prisma/client";
import { useCallback } from "react";
import type Scorm12API from "~/app/dts/Scorm12API";
import { getClientSideCookie } from "~/lib/common-client-side-utils/cookies";
import LMSManager from "../../../services/lms/manager";

declare global {
    interface Window {
        API?: Scorm12API;
        Scorm12API: Scorm12API;
    }
}

export function ScormContainer({ selectedCourse }: { selectedCourse?: Course }) {
    if (!selectedCourse) return;
    const userId = getClientSideCookie("userId");

    const launchPageURL = `${process.env.NEXT_PUBLIC_AWS_BUCKET_NGINX_ENDPOINT}/${selectedCourse.s3Path}${selectedCourse.indexFilePath}`

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const initializeWindow = useCallback(() => {
        require('scorm-again');

        const lms = new LMSManager(userId!, selectedCourse.name, () => { window.location.href = "/" });
        lms.initialize();
    }, [selectedCourse])

    if (typeof window !== "undefined") {
        initializeWindow();
    }


    return <div>
        <iframe src={launchPageURL} className="w-[80vw] h-[80vh] bg-white" />
    </div>
}