import { JSDOM } from 'jsdom'

export class XMLParser {
    public static parseXmlToDomDocument(xml: string) {
        const doc = new JSDOM(xml);
        return doc.window.document;
    }
}