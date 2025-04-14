import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "@repo/schema";
import { resolvers } from "@/lib/graphql/resolver";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    // Get Supabase client for the current request
    const supabase = await createClient();

    // Get session to determine current user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return {
      req,
      supabase,
      userId: session?.user?.id,
    };
  },
});

// Export properly typed handlers for Next.js API route
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}