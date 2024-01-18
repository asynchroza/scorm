import { CourseSelect } from "./components/SelectCourse";

export default function Display() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <CourseSelect courses={["accounting", "music producing"]}/>
            </div>
        </main>)
}