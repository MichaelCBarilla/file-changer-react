import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

let myS3Client: S3Client | null = null;

export const useS3Client = (): {
  uploadFile: (file: File) => Promise<void>;
} => {
  const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
  const awsRegion = import.meta.env.VITE_AWS_REGION;
  const idPool = import.meta.env.VITE_AWS_POOL_ID;
  if (!myS3Client) {
    try {
      myS3Client = new S3Client({
        region: awsRegion,
        credentials: fromCognitoIdentityPool({
          clientConfig: { region: awsRegion },
          identityPoolId: idPool,
        }),
      });
    } catch (error) {
      console.error('Error initializing S3 client:', error);
      throw error;
    }
  }

  const uploadFile = async (file: File) => {
    if (!myS3Client) {
      throw new Error('S3 client is not initialized');
    }

    try {
      await myS3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: `${bucketName}/${file.name}`,
          Body: file,
        })
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return { uploadFile };
};
