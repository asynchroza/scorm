import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { Extract } from 'unzipper';

export async function POST(request: Request) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        return NextResponse.json({ error: "No file was provided" }, { status: 400 });
    }

    if (!file.name.includes('.zip')) {
        // TODO: think of a better way to validate contents
        return NextResponse.json({ error: "Provided file is not a zip archive" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = `/tmp/${file.name}`
    await writeFile(path, buffer);

    const readStream = createReadStream(path);
    const extractionPath = `/tmp/extracted-${file.name}`

    readStream.pipe(Extract({ path: extractionPath }))
        .on('error', (err) => {
            return NextResponse.json({ error: err.message }, { status: 500 })
        });

    // TODO: verify file is of type zip
    // TODO: unarchive and check contents
    console.log(`open ${path} to see the uploaded file`)


    return NextResponse.json({ message: `Course was successfully uploaded` });
}