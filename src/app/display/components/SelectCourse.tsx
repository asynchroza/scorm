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

// this easily could be made content type agnostic (define within lib)
export function CourseSelect({ className = "", courses, setSelectedCourseS3Path }: { className?: string, courses: Course[], setSelectedCourseS3Path: Dispatch<SetStateAction<string>> }) {
    return (
            <Select onValueChange={(value) => { setSelectedCourseS3Path(value) }}>
                <SelectTrigger className={className}>
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