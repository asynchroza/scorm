import { error } from "console";
import { convertXML } from "simple-xml-to-json";

type ManifestOrganizations = {
    organizations: {
        title: string,
        children: {
            organization: {
                children: {
                    title: {
                        content: string
                    }
                }[] & unknown[]
            }
        }[]
    },
}

type ManifestResources = {
    resources: {
        children: {
            resource: {
                href: string
            }
        }[]
    }
}

type ParsedCourseXML = {
    manifest: {
        children: ManifestOrganizations[] | ManifestResources[]
    }
}

export default class CourseParser {
    public static getIndexAndName(xml: string) {
        console.log(xml)
        const manifest = (convertXML(xml) as ParsedCourseXML).manifest.children;
        console.log(manifest)
        const organizations = manifest.find(x => Object.keys(x).includes("organizations")) as ManifestOrganizations
        const resources = manifest.find(x => Object.keys(x).includes("resources")) as ManifestResources

        const name = organizations.organizations.children[0]!.organization.children[0]!.title.content;
        const indexFile = resources.resources.children[0]!.resource.href;

        return { indexFile, name };
    }
}