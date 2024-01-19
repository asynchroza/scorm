"use client"

import { useState } from "react";
import { CourseSelect } from "./SelectCourse";
import { ScormContainer } from "./ScormContainer";
import type { Course } from "@prisma/client";


export default function CoursesContainer({ courses }: { courses: Course[] }) {

    const [selectedCourseS3Path, setSelectedCourseS3Path] = useState<string>();

    return (
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <CourseSelect courses={courses} setSelectedCourseS3Path={setSelectedCourseS3Path} />
            <ScormContainer selectedCourse={courses.find(course => course.s3Path === selectedCourseS3Path)} />
        </div>
    )
}