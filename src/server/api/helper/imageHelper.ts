import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

export const createPresignedUrl = async (key: string, type: string) => {
  try {
    const signed = await createPresignedPost(s3Client, {
      Bucket: process.env.BUCKET_NAME as string,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 2048576], // up to 10 MB
        ['starts-with', '$Content-Type', type],
      ],
      Fields: {
        'Content-Type': type,
      },
      Expires: 600,
    });
    return signed;
  } catch (err) {
    throw err;
  }
};

export const deleteImage = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });

    const data = await s3Client.send(command);
    return data;
  } catch (err) {
    throw err;
  }
};
