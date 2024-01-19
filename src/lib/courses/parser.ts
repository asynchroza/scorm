import { xml2json } from "xml-js";
import { findNthOccurance } from "../utils";

type Resources = {
    name: 'resources',
    elements: {
        name: 'resource',
        attributes: {
            href: string
        }
    }[]
}[]

type Organiztions = {
    name: 'organization',
    elements: {
        type: 'element', name: 'title', elements: {
            content: string
        }[]
    }[]
}[]

type ParsedCourseXML = {
    elements: {
        elements: {
            name: 'organizations' | 'resources',
            elements:
            Organiztions
            & Resources
        }[]
    }[]
}

export default class CourseParser {

    private static getHrefAttribute(xml: string) {
        const attrRegex = /(?:<resource[^>]*\s+href="([^"]+)")[^>]*\s*\/?>\s*/g;
        const hrefRegex = /href="([^"]*)"/

        const attribute = xml.match(attrRegex)?.[0].match(hrefRegex)?.[0];
        const strippedHref = attribute?.substring(attribute.indexOf("\"") + 1, findNthOccurance(attribute, 2, "\"")).replaceAll("\\", "")

        return strippedHref;
    }
    public static getIndexAndName(xml: string) {
        const indexFile = this.getHrefAttribute(xml);

        return { indexFile, name: "something" };
    }
}