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
export function CourseSelect({ className = "", courses, setSelectedCourseId }: { className?: string, courses: Course[], setSelectedCourseId: Dispatch<SetStateAction<number | undefined>> }) {
    return (
            <Select onValueChange={(value) => { setSelectedCourseId(Number(value)) }}>
                <SelectTrigger className={className}>
                    <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Courses</SelectLabel>
                        {courses.map(course => (<SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>))}
                    </SelectGroup>
                </SelectContent>
            </Select>
    )
}