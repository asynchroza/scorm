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


export async function CourseSelect({ courses = [] }: { courses?: string[] }) {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {courses.map(course => (<SelectItem key={course} value={course}>{course}</SelectItem>))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )

}