import CoursesContainer from "./components/CoursesContainer";
import type { GetCoursesResponseBody } from "./types";

export default async function Display() {
    const response = await fetch(`${process.env.BASE_DOMAIN}/api/courses`);

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