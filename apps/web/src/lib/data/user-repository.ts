// lib/repositories/user-repository.ts
import { databases, ID, Query } from "@/lib/appwrite/client";
import { AppwriteCollections } from "@repo/types";
import { User, UserRole } from "@repo/schema";

// Constants for Appwrite configuration
const DATABASE_ID = "smartDashboard";
const USERS_COLLECTION_ID = "users";

export class UserRepository {
  /**
   * Get a user by ID
   */
  async getUser(id: string): Promise<User> {
    try {
      const user = await databases.getDocument<
        AppwriteCollections["users"]["Read"]
      >(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        id,
      );

      // Transform to domain model
      return {
        id: user.$id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills || [],
        avatar: user.avatar,
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const result = await databases.listDocuments<
        AppwriteCollections["users"]["Read"]
      >(
        DATABASE_ID,
        USERS_COLLECTION_ID,
      );

      // Map each user
      return result.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        email: doc.email,
        role: doc.role,
        skills: doc.skills || [],
        avatar: doc.avatar,
      }));
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(data: Omit<User, "id">): Promise<User> {
    try {
      const user = await databases.createDocument<
        AppwriteCollections["users"]["Read"]
      >(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          name: data.name,
          email: data.email,
          role: data.role,
          skills: data.skills || [],
          avatar: data.avatar,
        },
      );

      // Return the created user
      return {
        id: user.$id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills || [],
        avatar: user.avatar,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: Partial<Omit<User, "id">>): Promise<User> {
    try {
      // Build update object with only defined fields
      const updateData: Partial<AppwriteCollections["users"]["Update"]> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.role !== undefined) updateData.role = data.role as AppwriteCollections["users"]["Update"]["role"];
      if (data.skills !== undefined) updateData.skills = data.skills;
      if (data.avatar !== undefined) updateData.avatar = data.avatar;

      // Update document in Appwrite
      const user = await databases.updateDocument<
        AppwriteCollections["users"]["Read"]
      >(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        id,
        updateData,
      );

      // Return the updated user
      return {
        id: user.$id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills || [],
        avatar: user.avatar,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        id,
      );

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const result = await databases.listDocuments<
        AppwriteCollections["users"]["Read"]
      >(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("role", role)],
      );

      return result.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        email: doc.email,
        role: doc.role,
        skills: doc.skills || [],
        avatar: doc.avatar,
      }));
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  }

  /**
   * Get users by skill
   */
  async getUsersBySkill(skill: string): Promise<User[]> {
    try {
      const result = await databases.listDocuments<
        AppwriteCollections["users"]["Read"]
      >(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.search("skills", skill)],
      );

      return result.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        email: doc.email,
        role: doc.role,
        skills: doc.skills || [],
        avatar: doc.avatar,
      }));
    } catch (error) {
      console.error(`Error fetching users with skill ${skill}:`, error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await databases.listDocuments<
        AppwriteCollections["users"]["Read"]
      >(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("email", email)],
      );

      if (result.documents.length === 0) {
        return null;
      }

      const user = result.documents[0];

      if (!user) throw new Error("User not found");
      return {
        id: user.$id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills || [],
        avatar: user.avatar,
      };
    } catch (error) {
      console.error(`Error fetching user by email ${email}:`, error);
      throw error;
    }
  }
}

// Singleton instance
export const userRepository = new UserRepository();
