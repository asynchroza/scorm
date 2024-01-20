import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync } from "fs";
import { Parse, type Entry } from "unzipper";
import s3 from "~/services/aws/s3";
import { REQUIRED_FILES } from "./constants";
import { findNthOccurance } from "~/lib/utils";

type ProcessedEntriesType = {
    loadedManifest: string,
    filesToBePushedToS3: (() => void)[]
}

const createDirectory = (fullPath: string) => {
    const parentDirectory = fullPath.substring(0, fullPath.lastIndexOf('/'));

    if (!existsSync(parentDirectory)) {
        mkdirSync(parentDirectory, { recursive: true });
    }
}

const loadManifest = (fileNameStrippedOfDir: string, fullPath: string) => {
    if (fileNameStrippedOfDir.includes(REQUIRED_FILES.MANIFEST)) {
        return readFileSync(fullPath).toString();
    }

    return "";
}

/**
 * Reads and extracts files from a ZIP archive to /temp dir
 * and fetches the content of the 'imsmanifest.xml' file.
 * Returns a list of callbacks which are to be invoked once
 * all verifications are passed.
 *
 * @param {File} file - The File object representing the ZIP file.
 * @param {string} localPath - The local path to the ZIP file.
 * @param {string} s3Path - The parent S3 path where the files will be saved.
 * @param {object} verifiedFiles - Object used to store the state of verified files
 * @returns {Promise} an object storing the xml manifest and a list 
 * of callbacks used to push the unarchived files to S3
 * 
 * @throws {Error}
 * 
 * ! The handling with promises is required to avoid unexpected behaviour from stream piping.
 * ! Otherwise there's a chance we get fake positive responses.
 */


// <3 WE LOVE CLOSURES <3
export const processEntries = (file: File, localPath: string, s3Path: string, verifiedFiles: Record<string, boolean>) => {
    return new Promise<ProcessedEntriesType>((resolve, reject) => {
        const filesToBePushedToS3: (() => void)[] = [];
        let loadedManifest = "";

        const handleEntry = (entry: Entry) => {
            const fileName = entry.path;
            const fullPath = `/tmp/extracted-${file.name.replace('.zip', '')}/${fileName.substring(findNthOccurance(fileName, 3, "/"))}`;

            if (fullPath.endsWith('/')) {
                // Do not continue if entry is a directory
                return;
            }

            const fileNameStrippedOfDir = fileName.substring(fileName.lastIndexOf('/') + 1);

            if (Object.keys(verifiedFiles).includes(fileNameStrippedOfDir)) {
                verifiedFiles[fileNameStrippedOfDir] = true;
            }

            createDirectory(fullPath);

            entry.pipe(createWriteStream(fullPath))
                .on('finish', () => {
                    filesToBePushedToS3.push(() => { s3.saveFile(s3Path, fullPath) });

                    if (loadedManifest === "") {
                        loadedManifest = loadManifest(fileNameStrippedOfDir, fullPath);
                    }

                })
                .on('error', (e) => {
                    reject(e);
                });
        };

        const handleError = (err: Error) => {
            reject(err);
        };

        const handleEnd = () => {
            if (Object.values(verifiedFiles).includes(false)) {
                reject(new Error("Scorm package is missing required files"));
            }

            resolve({ loadedManifest, filesToBePushedToS3 });
        };

        createReadStream(localPath)
            .pipe(Parse())
            .on('entry', handleEntry)
            .on('error', handleError)
            .on('end', handleEnd);
    });
};
