import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "@repo/schema";
import { resolvers } from "@/lib/graphql/resolver";
import { createClient } from "@/lib/supabase/server";
import { NextApiHandler } from "next";

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler: NextApiHandler = startServerAndCreateNextHandler(server, {
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

// Export the handler for Next.js API route
export { handler as GET, handler as POST };
