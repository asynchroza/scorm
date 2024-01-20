import { XMLParser } from "~/services/parser/xml";

export default class CourseParser {

    private static getHrefAttribute(doc: Document) {
        if (doc.querySelector('organization')?.getAttribute('structure') === "hierarchical"){
            // it means that there isn't a defined base <resource/>, 
            // but instead we have to find it using the reference id from the parent item
            const ref = doc.querySelector('organization')?.querySelector('item')?.getAttribute('identifierref')
            return doc.querySelector(`[identifier=${ref}]`)?.getAttribute('href')
        }

        return doc.querySelector('resource')?.getAttribute('href');
    }

    private static getTitle(doc: Document) {
        return doc.querySelector('organization')?.querySelector('title')?.text;
    }

    public static getIndexAndName(xml: string) {
        const doc = XMLParser.parseXmlToDomDocument(xml);
        const indexFile = this.getHrefAttribute(doc);
        const name = this.getTitle(doc);

        if (!name || !indexFile) {
            throw new Error("Manifest couldn't be parsed");
        }

        return { indexFile, name };
    }
}