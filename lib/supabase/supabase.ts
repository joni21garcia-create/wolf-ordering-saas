import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

console.log("SUPABASE DEBUG", {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 15),
});

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

