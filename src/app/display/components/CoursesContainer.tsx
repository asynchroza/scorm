"use client"

import { Fragment, useState } from "react";
import { CourseSelect } from "./SelectCourse";
import { ScormContainer } from "./ScormContainer";
import type { Course } from "@prisma/client";


export default function CoursesContainer({ courses }: { courses: Course[] }) {
    const [selectedCourseS3Path, setSelectedCourseS3Path] = useState<string>();

    return (
        <Fragment>
            <CourseSelect className="absolute top-[12px] w-[50vw]" courses={courses} setSelectedCourseS3Path={setSelectedCourseS3Path} />
            <ScormContainer selectedCourse={courses.find(course => course.s3Path === selectedCourseS3Path)} />
        </Fragment>
    )
}