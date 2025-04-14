import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase-generated";

export interface GraphQLContext {
  req: Request;
  supabase: SupabaseClient<Database>;
  userId: string | null;
}
