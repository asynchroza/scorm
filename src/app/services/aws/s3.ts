import aws from 'aws-sdk'
import { type ManagedUpload } from 'aws-sdk/clients/s3';
import { createReadStream } from 'fs';

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

    public saveFile(dir: string, path: string) {
        const config = {
            Key: dir + path.substring(path.lastIndexOf('/') + 1),
            Body: createReadStream(path),
            Bucket: process.env.AWS_BUCKET ?? ""
        }

        this.s3.upload(config, (err: Error, data: ManagedUpload.SendData) => {
            if (err) {
                throw err
            } else {
                console.log('File uploaded successfully. File location:', data.Location);
            }
        });
    }
}

const s3 = new ObjectService()
export default s3;