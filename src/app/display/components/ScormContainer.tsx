"use client"
import type { Course } from "@prisma/client";
import type Scorm12API from "~/app/dts/Scorm12API";

declare global {
    interface Window {
        API?: Scorm12API;
        Scorm12API: Scorm12API;
    }
}

export function ScormContainer({selectedCourse}: {selectedCourse?: Course}) {
    if (!selectedCourse) return;

    if (typeof window !== "undefined") {
        require('scorm-again');
        // const settings = window.getSec
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        window.API = new window.Scorm12API({});
    }

    const launchPage = `${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/${selectedCourse.s3Path}shared/launchpage.html`

    return <div>
        <iframe src={launchPage} className="w-[80vw] h-[80vh] bg-white"/>
    </div>
}