import { createReadStream, createWriteStream } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { type Entry, Parse } from "unzipper";
import s3 from "~/app/services/aws/s3";

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

// ! otherwise the stream is not awaited and we get fake positives
const saveAndUploadFiles = (path: string, file: File) => new Promise<void>((resolve, reject) => {

    const verifiedFiles: Record<string, boolean> = {
        "imsmanifest.xml": false
    };

    createReadStream(path)
        .pipe(Parse())
        .on('entry', function (entry: Entry) {
            const fileName = entry.path;

            if (fileName.endsWith('/')) {
                return;
            }

            const fileNameStrippedOfDir = fileName.substring(fileName.lastIndexOf('/') + 1)

            // check if file is present within the list of required files and flip its flag
            if (Object.keys(verifiedFiles).includes(fileNameStrippedOfDir)) {
                verifiedFiles[fileNameStrippedOfDir] = true;
            }

            const fullPath = `/tmp/extracted-${file.name.replace('.zip', '')}/${fileNameStrippedOfDir}`

            entry.pipe(createWriteStream(fullPath));
            s3.saveFile(`${file.name.replace('.zip', '')}/`, fullPath)
        }).on('error', function (err) {
            reject(err.message)
        }).on('end', function () {
            // reject promise if any of the files is not verified
            if (Object.values(verifiedFiles).includes(false)) {
                reject("Scorm package is missing required files");
            }

            resolve();
        })
})


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

    await saveAndUploadFiles(path, file).catch((e: string) => {
        return NextResponse.json({ message: `Something went wrong uploading the course`, error: e }, { status: 500 });
    })

    // TODO: store course by name, path

    return NextResponse.json({ message: `Course was successfully uploaded` });
}