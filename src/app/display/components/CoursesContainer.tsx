"use client"

import { Fragment, useState } from "react";
import { CourseSelect } from "./SelectCourse";
import { ScormContainer } from "./ScormContainer";
import type { Course } from "@prisma/client";
import { useSearchParams } from "next/navigation";


export default function CoursesContainer({ courses }: { courses: Course[] }) {
    const params = useSearchParams();
    const course = params.get('course');
    console.log(course);
    const [selectedCourseS3Path, setSelectedCourseS3Path] = useState<string>(course ?? "");

    return (
        <Fragment>
            <CourseSelect className="absolute top-[12px] w-[50vw]" courses={courses} setSelectedCourseS3Path={setSelectedCourseS3Path} />
            <ScormContainer selectedCourse={courses.find(course => course.s3Path === selectedCourseS3Path)} />
        </Fragment>
    )
}