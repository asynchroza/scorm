import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import CourseParser from "~/app/api/courses/parser";
import { db } from "~/server/db";
import { REQUIRED_FILES } from "./constants";
import { processEntries } from "./pipes";

const createDirIfNotExistent = async (path: string) => {
    try {
        await mkdir(path)
    } catch { }
}

const saveZipTemporarilyAndFetchPath = async (file: File) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = `/tmp/${file.name}`
    await writeFile(path, buffer);

    return path;
}


const upsertCourse = async (name: string, s3Path: string, indexFilePath: string) => {
    return await db.course.upsert({
        where: {
            s3Path
        }, update: {
            name,
            s3Path,
            indexFilePath
        }, create: {
            name,
            s3Path,
            indexFilePath
        }
    })
}


export async function GET() {
    return NextResponse.json({ courses: await db.course.findMany() })
}

export async function POST(request: Request) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file || !file.name.includes('.zip')) {
        return NextResponse.json({ error: "Provided file is not a zip archive" }, { status: 400 });
    }

    const verifiedFiles: Record<string, boolean> = {
        [REQUIRED_FILES.MANIFEST]: false
    };

    try {
        const path = await saveZipTemporarilyAndFetchPath(file);

        await createDirIfNotExistent(`/tmp/extracted-${file.name}`.replace('.zip', ''));
        const s3Path = `${file.name.replace('.zip', '')}/`;

        const {loadedManifest, filesToBePushedToS3} = await processEntries(file, path, s3Path, verifiedFiles)   

        const parsedManifest = CourseParser.getIndexAndName(loadedManifest);
        filesToBePushedToS3.forEach(save => save())

        await upsertCourse(parsedManifest.name, s3Path, parsedManifest.indexFile);
    } catch (e) {
        return NextResponse.json({ message: `Something went wrong uploading the course`, error: e instanceof Error ? e.message : e }, { status: 500 });
    }

    return NextResponse.json({ message: `Course was successfully uploaded` });
}