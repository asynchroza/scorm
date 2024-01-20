import type { Course } from "@prisma/client"

export type GetCoursesResponseBody = {
    courses: Course[]
}

