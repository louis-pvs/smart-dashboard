"use client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createClient } from "@/lib/supabase/client";
import { ReactNode, useEffect, useState } from "react";

export default function ApolloClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token || null;
      setToken(accessToken);
    };

    getToken();
  }, []);

  const httpLink = createHttpLink({
    uri: "/api/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
