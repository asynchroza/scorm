import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "src/components/ui/select"
import type { Dispatch, SetStateAction } from "react";
import type { Course } from "@prisma/client";


export function CourseSelect({ courses, setSelectedCourseS3Path }: { courses: Course[], setSelectedCourseS3Path: Dispatch<SetStateAction<string | undefined>> }) {

    return (
        <Select onValueChange={(value) => { setSelectedCourseS3Path(value) }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {courses.map(course => (<SelectItem key={course.id} value={course.s3Path}>{course.name}</SelectItem>))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )

}