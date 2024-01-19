"use client"

import { Fragment, useState } from "react";
import { CourseSelect } from "./SelectCourse";
import { ScormContainer } from "./ScormContainer";
import type { Course } from "@prisma/client";
import { useSearchParams } from "next/navigation";


export default function CoursesContainer({ courses }: { courses: Course[] }) {
    const params = useSearchParams();
    const course = params.get('course');
    const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(Number(course));

    return (
        <Fragment>
            <CourseSelect className="absolute top-[12px] w-[50vw]" courses={courses} setSelectedCourseId={setSelectedCourseId} />
            <ScormContainer selectedCourse={courses.find(course => course.id === selectedCourseId)} />
        </Fragment>
    )
}