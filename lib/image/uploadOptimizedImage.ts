import { uploadFile } from "@/lib/storage/upload";

interface UploadImageParams {
  buffer: Buffer;
  bucket: string;
  path: string;
  contentType: string;
}

export async function uploadOptimizedImage({
  buffer,
  bucket,
  path,
  contentType,
}: UploadImageParams) {
  //----------------------------------
  // Upload
  //----------------------------------
  console.log({
    bucket,
    path,
    contentType,
  });

  const result = await uploadFile({
    key: `${bucket}/${path}`,
    body: buffer,
    contentType,
  });

  return {
    bucket,
    path,
    url: result.url,
  };
}