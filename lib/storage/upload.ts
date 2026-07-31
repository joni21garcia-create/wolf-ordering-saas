import { PutObjectCommand } from "@aws-sdk/client-s3";
import { storage } from "./provider";
import { getPublicUrl } from "./signed-url";

export interface UploadFileParams {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}

export async function uploadFile({
  key,
  body,
  contentType,
}: UploadFileParams) {
  await storage.client.send(
    new PutObjectCommand({
      Bucket: storage.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return {
    key,
    url: getPublicUrl(key),
  };
}