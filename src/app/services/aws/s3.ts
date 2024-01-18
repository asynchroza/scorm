import aws from 'aws-sdk'
import { type ManagedUpload } from 'aws-sdk/clients/s3';
import { createReadStream } from 'fs';

aws.config.update({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new aws.S3();

export const saveFile = (dir: string, path: string) => {
    throw new Error("SOMETHING");
    const config = {
        Key: dir + path.substring(path.lastIndexOf('/') + 1),
        Body: createReadStream(path),
        Bucket: process.env.AWS_BUCKET ?? ""
    }

    s3.upload(config, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File uploaded successfully. File location:', data.Location);
        }
    });
}

