import { env } from "@/lib/env";

const constructS3ImageUrl = (key: string): string => {
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${key}`;
};

export default constructS3ImageUrl;
