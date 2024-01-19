import { CONTENT_TYPES } from "./constants";

export function getFileExtension(fileName: string) {
    // Use regex to match the file extension
    const regex = /\.([0-9a-z]+)$/i;
    const extensionMatch = fileName.match(regex);

    if (extensionMatch && extensionMatch.length > 1) {
        return extensionMatch[0].toLowerCase();
    } 

    return null;
}

export function getContentHeader (fileName: string) {
    const fileExtension = getFileExtension(fileName);
    if (!fileExtension) return {};

    if(Object.keys(CONTENT_TYPES).includes(fileExtension)){
        return {ContentType: CONTENT_TYPES[fileExtension]}
    }

    return {}
}
