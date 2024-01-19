import Script from "next/script";
import CoursesContainer from "./components/CoursesContainer";
import type { GetCoursesResponseBody } from "./types";
import { ScormContainer } from "./components/ScormContainer";

export default async function Display() {

    const response = await fetch('http://localhost:3000/api/courses', { cache: 'force-cache' });

    if (!response.ok) {
        return <p>Something went wrong</p>
    }

    const body = await response.json() as GetCoursesResponseBody;

    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
                <CoursesContainer courses={body.courses} />
            </div>
        </>
    )
}