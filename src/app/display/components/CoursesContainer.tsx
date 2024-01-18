"use client"

import { useState } from "react";
import type { GetCoursesResponseBody } from "../types";
import { CourseSelect } from "./SelectCourse";
import { ScormContainer } from "./ScormContainer";

export default function CoursesContainer({ courseBody: coursesBody }: { courseBody: GetCoursesResponseBody }) {

    const [selectedCourse, setSelectCourse] = useState<string>();

    return (
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <CourseSelect coursesBody={coursesBody} setSelectedCourse={setSelectCourse}/>
        </div>
    )
}