import AWS from 'aws-sdk';
import { env } from './authConfig';

export const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY!,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  region: env.AWS_REGION,
});
