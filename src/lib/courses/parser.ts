import { xml2json } from "xml-js";
import { findNthOccurance } from "../utils";

export default class CourseParser {

    private static getHrefAttribute(xml: string) {
        const attrRegex = /(?:<resource[^>]*\s+href="([^"]+)")[^>]*\s*\/?>\s*/g;
        const hrefRegex = /href="([^"]*)"/

        const attribute = xml.match(attrRegex)?.[0].match(hrefRegex)?.[0];
        const strippedHref = attribute?.substring(attribute.indexOf("\"") + 1, findNthOccurance(attribute, 2, "\"")).replaceAll("\\", "")

        return strippedHref;
    }

    private static getTitle(xml: string) {
        const titleRegex = /<title>(.*?)<\/title>/;

        // Extract the value between <title> tags
        const match = xml.match(titleRegex)?.[0];
        return match?.substring(match.indexOf('>') + 1, findNthOccurance(match, 2, '<'));
    }

    public static getIndexAndName(xml: string) {
        const indexFile = this.getHrefAttribute(xml);
        const name = this.getTitle(xml);

        return { indexFile, name };
    }
}