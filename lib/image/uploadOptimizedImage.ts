import { createClient } from "@supabase/supabase-js";



const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


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
  const { error } =
    await supabase.storage
      .from(bucket)
      .upload(
        path,
        buffer,
        {
          upsert: true,
      contentType,
        }
      );

  if (error) {
    throw error;
  }

  //----------------------------------
  // URL pública
  //----------------------------------

  const { data } =
    supabase.storage
      .from(bucket)
      .getPublicUrl(path);

  return {
    bucket,
    path,
    url: data.publicUrl,
  };
}