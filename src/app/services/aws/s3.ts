import aws from 'aws-sdk'
import { readFileSync } from 'fs';
import { getContentHeader } from './utils';

class ObjectService {
    s3: aws.S3;

    constructor() {
        aws.config.update({
            region: 'eu-north-1',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        this.s3 = new aws.S3();
    }


    /**
     * Saves a locally stored file to an S3 Bucket
     *
     * @public
     * @param {string} dir - directory where you want to store the file
     * @param {string} path - local path to file
     */
    public saveFile(dir: string, path: string) {
        const config = {
            Key: dir + path.substring(path.lastIndexOf('/') + 1),
            Bucket: process.env.AWS_BUCKET ?? "",
            Body: readFileSync(path),
            ACL: 'public-read',
            ...getContentHeader(path)
        }

        this.s3.upload(config, (err: Error) => {
            if (err) throw err;
        });
    }
}

const s3 = new ObjectService()
export default s3;