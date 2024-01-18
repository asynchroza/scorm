import { createReadStream, createWriteStream } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { type Entry, Parse } from "unzipper";

const createDirIfNotExistent = async (path: string) => {
    try {
        await mkdir(path);
    } catch (e) {
        console.error(e);
    }
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = `/tmp/${file.name}`
    await writeFile(path, buffer);


    createReadStream(path)
        .pipe(Parse())
        .on('entry', function (entry: Entry) {
            const fileName = entry.path;
            const type = entry.type; // 'Directory' or 'File'

            if (fileName.endsWith('/')) {
                return;
            }

            console.log('[FILE]', fileName, type);

            // TODO: probably also needs the security check
            const fileNameStrippedOfDir = fileName.substring(fileName.lastIndexOf('/') + 1)

            entry.pipe(createWriteStream(`/tmp/extracted-${file.name.replace('.zip', '')}/${fileNameStrippedOfDir}`));
            // NOTE: To ignore use entry.autodrain() instead of entry.pipe()
        });

    // TODO: delete directory upon failure

    return NextResponse.json({ message: `Course was successfully uploaded` });
}