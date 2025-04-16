import { Account, Client, Databases, Functions, Storage, ID, Query, RealtimeResponseEvent } from "appwrite";

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint("http://localhost/v1") // Your Appwrite API endpoint
  .setProject("YOUR_PROJECT_ID"); // Your project ID from Appwrite console

// Export services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// For realtime functionality, use the client's subscribe method directly
interface SubscriptionCallback {
  (response: RealtimeResponseEvent<unknown>): void;
}

export const subscribe = (
  channels: string | string[],
  callback: SubscriptionCallback
) => {
  return client.subscribe(channels, callback);
};

export { client, ID, Query };
