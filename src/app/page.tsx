import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <Link href='/upload' className="hover:text-gray-300">Upload</Link> or <Link href="/do" className="hover:text-gray-300">do</Link> <span className="text-[hsl(280,100%,70%)]">Scorm</span> quizzes
        </h1>
      </div>
    </div>
  );
}
