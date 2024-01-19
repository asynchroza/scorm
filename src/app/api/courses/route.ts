import { createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { preconnect } from "react-dom";
import { type Entry, Parse } from "unzipper";
import s3 from "~/app/services/aws/s3";
import { findNthOccurance } from "~/lib/utils";
import { db } from "~/server/db";

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

function pause(milliseconds) {
    var dt = new Date();
    while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

// ! otherwise the stream is not awaited and we get fake positives
const saveAndUploadFiles = (localPath: string, s3Path: string, file: File) => new Promise<void>((resolve, reject) => {

    const verifiedFiles: Record<string, boolean> = {
        "imsmanifest.xml": false
    };

    createReadStream(localPath)
        .pipe(Parse())
        .on('entry', function (entry: Entry) {
            const fileName = entry.path;
            const fullPath = `/tmp/extracted-${file.name.replace('.zip', '')}/${fileName.substring(findNthOccurance(fileName, 3, "/"))}`

            if (fullPath.endsWith('/')) {
                return;
            }

            const fileNameStrippedOfDir = fileName.substring(fileName.lastIndexOf('/') + 1)

            // check if file is present within the list of required files and flip its flag
            if (Object.keys(verifiedFiles).includes(fileNameStrippedOfDir)) {
                verifiedFiles[fileNameStrippedOfDir] = true;
            }

            const parentDirectory = fullPath.substring(0, fullPath.lastIndexOf('/'))

            if (!existsSync(parentDirectory)) {
                mkdirSync(parentDirectory, {recursive: true})
            }

            entry.pipe(createWriteStream(fullPath)).on('finish', () => {
                s3.saveFile(s3Path, fullPath)
            }).on('error', (e) => {
                throw e;
            });
        }).on('error', function (err) {
            reject(err)
        }).on('end', function () {
            // reject promise if any of the files is not verified
            if (Object.values(verifiedFiles).includes(false)) {
                reject(new Error("Scorm package is missing required files"));
            }

            resolve();
        })
})

const upsertCourse = async (name: string, s3Path: string) => {
    return await db.course.upsert({
        where: {
            s3Path
        }, update: {
            name,
            s3Path
        }, create: {
            name,
            s3Path
        }
    })
}

export async function GET() {
    return NextResponse.json({ courses: await db.course.findMany() })
}

export async function POST(request: Request) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        return NextResponse.json({ error: "No file was provided" }, { status: 400 });
    }

    if (!file.name.includes('.zip')) {
        return NextResponse.json({ error: "Provided file is not a zip archive" }, { status: 400 });
    }

    const path = await saveZipTemporarilyAndFetchPath(file);

    await createDirIfNotExistent(`/tmp/extracted-${file.name}`.replace('.zip', ''));

    const s3Path = `${file.name.replace('.zip', '')}/`;

    const error = await saveAndUploadFiles(path, s3Path, file).catch((e: Error) => e)

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Something went wrong uploading the course`, error: error.message }, { status: 500 });
    }

    await upsertCourse(file.name, s3Path);
    return NextResponse.json({ message: `Course was successfully uploaded` });
}