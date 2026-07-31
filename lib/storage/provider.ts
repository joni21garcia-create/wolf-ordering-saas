import { r2 } from "./r2";

export const storage = {
  client: r2,

  bucket: process.env.R2_BUCKET!,
};