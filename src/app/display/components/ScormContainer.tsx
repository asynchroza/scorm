"use client"
import type { Course } from "@prisma/client";
import { useCallback } from "react";
import type Scorm12API from "~/app/dts/Scorm12API";

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
        // const settings = window.getSec
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        window.API = new window.Scorm12API({});
    }, [])

    if (typeof window !== "undefined") {
        initializeWindow();
    }


    return <div>
        <iframe src={launchPageURL} className="w-[80vw] h-[80vh] bg-white" />
    </div>
}