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
import type { GetCoursesResponseBody } from "../types"
import type { Dispatch, SetStateAction } from "react";


export function CourseSelect({ coursesBody, setSelectedCourse }: { coursesBody: GetCoursesResponseBody, setSelectedCourse: Dispatch<SetStateAction<string | undefined>> }) {

    return (
        <Select onValueChange={(value) => { setSelectedCourse(value) }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {coursesBody.courses.map(course => (<SelectItem key={course.id} value={course.s3Path}>{course.name}</SelectItem>))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )

}