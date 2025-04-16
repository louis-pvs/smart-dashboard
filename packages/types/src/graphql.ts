// @repo/types/src/graphql.ts
import { Client, Account, Databases, Storage, Functions, ID, Query, RealtimeResponseEvent } from "appwrite";

// Define the subscription callback type
interface SubscriptionCallback {
  (response: RealtimeResponseEvent<unknown>): void;
}

// Define the subscribe function type
type SubscribeFunction = (
  channels: string | string[],
  callback: SubscriptionCallback
) => () => void;

export interface AppwriteServices {
  client: Client;
  account: Account;
  databases: Databases;
  storage: Storage;
  functions: Functions;
  ID: typeof ID;
  Query: typeof Query;
  subscribe: SubscribeFunction;
}

export interface GraphQLContext {
  req: Request;
  appwrite: AppwriteServices;
  userId: string | null;
}
