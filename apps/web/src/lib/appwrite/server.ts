import { Account, Client, Databases, Storage, Teams, Functions } from "node-appwrite";
import { cookies } from "next/headers";

// Define the session cookie name
export const SESSION_COOKIE = "appwrite_session";

// Create an admin client for privileged operations (no user session required)
export function createAdminClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const apiKey = process.env.APPWRITE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_APPWRITE_ENDPOINT is not set");
  }

  if (!apiKey) {
    throw new Error("APPWRITE_API_KEY is not set");
  }

  if (!projectId) {
    throw new Error("NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)
    .setSelfSigned(process.env.NODE_ENV !== 'production'); // Only for dev environment

  return {
    get client() {
      return client;
    },
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get teams() {
      return new Teams(client);
    },
    get functions() {
      return new Functions(client);
    }
  };
}

// Create a server client for authenticated user operations
export async function createServerClient() {
  const cookieStore = await cookies();
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_APPWRITE_ENDPOINT is not set");
  }

  if (!projectId) {
    throw new Error("NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setSelfSigned(process.env.NODE_ENV !== 'production'); // Only for dev environment

  // Get the session cookie and set it on the client if it exists
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (sessionCookie) {
    client.setSession(sessionCookie.value);
  }

  return {
    get client() {
      return client;
    },
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get teams() {
      return new Teams(client);
    },
    get functions() {
      return new Functions(client);
    }
  };
}

// Helper function to get the current user from a server component
export async function getCurrentUser() {
  try {
    const { account } = await createServerClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}

// Helper function to require authentication (for protected routes)
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

// Helper function for handling session during form submissions
export async function getSessionForServerAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  return sessionCookie ? sessionCookie.value : null;
}
