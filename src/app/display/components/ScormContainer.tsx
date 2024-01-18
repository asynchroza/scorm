"use client"
import type Scorm12API from "~/app/dts/Scorm12API";

declare global {
    interface Window {
        API?: Scorm12API; 
        Scorm12API: Scorm12API;
    }
}

export function ScormContainer() {
    if (typeof window !== "undefined") {
        require('scorm-again');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        window.API = new window.Scorm12API({});

    }

    return <div>HELLO WORLD</div>
}