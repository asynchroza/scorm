import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { type Entry, Parse } from "unzipper";
import s3 from "~/app/services/aws/s3";
import CourseParser from "~/lib/courses/parser";
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

/**
 * Reads and extracts files from a ZIP archive, saves them to a specified S3 path, 
 * and fetches the content of the 'imsmanifest.xml' file.
 *
 * @param {string} localPath - The local path to the ZIP file.
 * @param {string} s3Path - The parent S3 path where the files will be saved.
 * @param {File} file - The File object representing the ZIP file.
 * @returns {Promise<string>} A Promise that resolves with the content of the 'imsmanifest.xml' file.
 * @throws {Error} If the SCORM package is missing required files.
 * 
 * The handling with promises is required to avoid unexpected behaviour from stream piping.
 * Otherwise there's a chance we get fake positive responses.
 */
const saveFilesAndFetchManifest = (localPath: string, s3Path: string, file: File) => new Promise<string>((resolve, reject) => {

    const verifiedFiles: Record<string, boolean> = {
        "imsmanifest.xml": false
    };

    let loadManifest = "";

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
                mkdirSync(parentDirectory, { recursive: true })
            }

            // Pipes are behaving really strangely and should be handled with 
            // their event listeners and be wrapped in promises
            // to behave fully synchronously
            entry.pipe(createWriteStream(fullPath)).on('finish', () => {
                s3.saveFile(s3Path, fullPath)

                if (fileNameStrippedOfDir.includes("imsmanifest.xml")) {
                    loadManifest = readFileSync(fullPath).toString();
                }

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

            resolve(loadManifest);
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

    const manifest = await saveFilesAndFetchManifest(path, s3Path, file) as string | Error

    if (manifest instanceof Error) {
        return NextResponse.json({ message: `Something went wrong uploading the course`, error: manifest.message }, { status: 500 });
    }

    const parsedManifest = CourseParser.getIndexAndName(manifest);

    await upsertCourse(parsedManifest.name, s3Path);
    return NextResponse.json({ message: `Course was successfully uploaded` });
}