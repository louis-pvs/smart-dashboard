import { OpenAI } from "openai";
import { databases, Query } from "@/lib/appwrite/client";
import {
  AIPrediction,
  BurndownPoint,
  createAICacheSchema,
  RiskFactor,
  SprintReport,
  Task,
  TeamPerformanceMetric,
} from "@repo/schema";
import { AppwriteModel } from "@repo/types";

// Constants for Appwrite configuration
const DATABASE_ID = "smartDashboard";
const AI_CACHE_COLLECTION_ID = "aiCache";

export class AIService {
  private client: OpenAI;

  constructor() {
    // Initialize the OpenAI client with Perplexity API configuration
    this.client = new OpenAI({
      apiKey: process.env.PERPLEXITY_API_KEY || "",
      baseURL: "https://api.perplexity.ai",
    });
  }

  /**
   * Generate a response from Perplexity API with caching
   */
  private async generateResponse(
    prompt: string,
    model: string = "sonar-pro",
  ): Promise<string> {
    if (!process.env.PERPLEXITY_API_KEY) {
      throw new Error("Perplexity API key is not configured");
    }

    // Create a hash of the prompt for caching
    const inputHash = this.createHash(prompt + model);

    try {
      // Check cache first
      const cachedResult = await this.getCachedResult(inputHash);
      if (cachedResult) {
        return cachedResult;
      }

      // Call Perplexity API
      const response = await this.client.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are a project management AI assistant that provides accurate, data-driven insights.",
          },
          { role: "user", content: prompt },
        ],
      });

      const message = response.choices[0]?.message?.content;
      if (!message) {
        throw new Error("No response from Perplexity API");
      }

      // Cache the result
      await this.cacheResult(inputHash, message);

      return message;
    } catch (error) {
      console.error("Error calling Perplexity API:", error);
      throw error;
    }
  }

  /**
   * Create a hash for caching
   */
  private createHash(input: string): string {
    // Simple hash function for demo purposes
    // In production, use a proper hashing algorithm
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  /**
   * Get cached result if available
   */
  private async getCachedResult(inputHash: string): Promise<string | null> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        AI_CACHE_COLLECTION_ID,
        [Query.equal("inputHash", inputHash)],
      );

      if (result.documents.length > 0 && result.documents[0]) {
        return result.documents[0].result;
      }

      return null;
    } catch (error) {
      console.warn("Cache retrieval error:", error);
      return null;
    }
  }

  /**
   * Cache result for future use
   */

  /**
   * Cache result for future use
   */
  private async cacheResult(inputHash: string, result: string): Promise<void> {
    try {
      // Validate with Zod schema
      const cacheData = createAICacheSchema.parse({
        inputHash,
        result,
      });

      await databases.createDocument(
        DATABASE_ID,
        AI_CACHE_COLLECTION_ID,
        "unique()",
        cacheData,
      );
    } catch (error) {
      console.warn("Cache storage error:", error);
    }
  }

  /**
   * Generate AI task estimate
   */
  async generateTaskEstimate(taskId: string): Promise<AIPrediction> {
    try {
      // Fetch task details
      const task = await databases.getDocument(
        DATABASE_ID,
        "tasks",
        taskId,
      );

      // Create prompt for estimation
      const prompt = `
        Based on the following task details, estimate how many hours it would take to complete this task:

        Title: ${task.title}
        Description: ${task.description || "No description provided"}
        Status: ${task.status}

        Provide your estimate in hours as a number, and also provide a confidence score between 0 and 1.
        Format your response as a JSON object with two properties: "estimatedHours" (number) and "confidence" (number).
      `;

      const response = await this.generateResponse(prompt);

      // Parse the response
      try {
        const parsed = JSON.parse(response);

        return {
          taskId,
          estimatedHours: parsed.estimatedHours,
          confidence: parsed.confidence,
          createdAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Error parsing AI response:", error);
        // Fallback to a default estimate if parsing fails
        return {
          taskId,
          estimatedHours: 4, // Default estimate
          confidence: 0.5, // Default confidence
          createdAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error("Error generating task estimate:", error);
      throw error;
    }
  }

  /**
   * Analyze project risks
   */
  async analyzeProjectRisks(projectId: string): Promise<RiskFactor[]> {
    try {
      // Fetch project details
      const project = await databases.getDocument(
        DATABASE_ID,
        "projects",
        projectId,
      );

      // Fetch project tasks
      const tasksResult = await databases.listDocuments(
        DATABASE_ID,
        "tasks",
        [Query.equal("projectId", projectId)],
      );

      // Create prompt for risk analysis
      const prompt = `
        Analyze the following project for potential risks:

        Project Name: ${project.name}
        Project Description: ${project.description || "No description provided"}

        Tasks (${tasksResult.documents.length}):
        ${
        tasksResult.documents.map((task) =>
          `- ${task.title} (Status: ${task.status})`
        ).join("\n")
      }

        Identify 3-5 potential risk factors for this project. For each risk:
        1. Provide a description of the risk
        2. Assign a severity level (LOW, MEDIUM, HIGH, or CRITICAL)
        3. Suggest a mitigation strategy

        Format your response as a JSON array of objects, each with "description", "severity", and "mitigationSuggestion" properties.
      `;

      const response = await this.generateResponse(prompt);

      // Parse the response
      try {
        const parsed = JSON.parse(response);

        return parsed.map((risk: any) => ({
          id: "unique()",
          projectId,
          description: risk.description,
          severity: risk.severity,
          mitigationSuggestion: risk.mitigationSuggestion,
          createdAt: new Date().toISOString(),
        }));
      } catch (error) {
        console.error("Error parsing AI response:", error);
        // Return a default risk if parsing fails
        return [{
          id: "unique()",
          projectId,
          description: "Potential schedule overrun based on task complexity",
          severity: "MEDIUM",
          mitigationSuggestion: "Review task estimates and add buffer time",
          createdAt: new Date().toISOString(),
        }];
      }
    } catch (error) {
      console.error("Error analyzing project risks:", error);
      throw error;
    }
  }

  /**
   * Generate sprint report
   */
  async generateSprintReport(
    projectId: string,
    startDate: string,
    endDate: string,
  ): Promise<SprintReport> {
    try {
      // Fetch project details
      const project = await databases.getDocument(
        DATABASE_ID,
        "projects",
        projectId,
      );

      // Fetch completed tasks in the date range
      const tasksResult = await databases.listDocuments<Task & AppwriteModel>(
        DATABASE_ID,
        "tasks",
        [
          Query.equal("projectId", projectId),
          Query.equal("status", "DONE"),
          Query.greaterThanEqual("$updatedAt", startDate),
          Query.lessThanEqual("$updatedAt", endDate),
        ],
      );

      // Create burndown data (simplified)
      const burndownData = this.generateBurndownData(
        startDate,
        endDate,
        tasksResult.documents,
      );

      // Generate team performance metrics
      const teamPerformance = await this.generateTeamPerformanceMetrics(
        projectId,
        startDate,
        endDate,
      );

      // Create prompt for AI insights
      const prompt = `
        Generate insights for a sprint report with the following data:

        Project: ${project.name}
        Sprint Period: ${startDate} to ${endDate}
        Completed Tasks: ${tasksResult.documents.length}

        Key Metrics:
        - Average completion time: ${
        this.calculateAverageCompletionTime(teamPerformance)
      } hours
        - Team velocity: ${tasksResult.documents.length} tasks

        Provide 3-5 insights about the sprint performance, including:
        1. What went well
        2. Areas for improvement
        3. Recommendations for the next sprint

        Keep your response under 500 words.
      `;

      const aiInsights = await this.generateResponse(prompt);

      return {
        id: "unique()",
        projectId,
        startDate,
        endDate,
        completedTasks: tasksResult.documents.length,
        burndownData,
        teamPerformance,
        aiInsights,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error generating sprint report:", error);
      throw error;
    }
  }

  private generateBurndownData(
    startDate: string,
    endDate: string,
    tasks: Task[],
  ): BurndownPoint[] {
    // This is a simplified implementation
    // In a real application, you would calculate actual remaining hours per day
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    const totalHours = tasks.reduce(
      (sum, task) => sum + (task.aiEstimatedHours || 4),
      0,
    );
    const burndownData = [];

    for (let i = 0; i < dayCount; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      const idealRemainingHours = totalHours * (1 - (i / (dayCount - 1)));

      // Calculate actual remaining hours based on completion dates
      const completedByThisDay = tasks.filter((task) => {
        const completionDate = new Date(task.updatedAt);
        return completionDate <= currentDate;
      });

      const completedHours = completedByThisDay.reduce(
        (sum, task) => sum + (task.aiEstimatedHours || 4),
        0,
      );

      const remainingHours = totalHours - completedHours;

      burndownData.push({
        date: currentDate.toISOString(),
        remainingHours,
        idealRemainingHours,
      });
    }

    return burndownData;
  }

  /**
   * Generate team performance metrics
   */
  private async generateTeamPerformanceMetrics(
    projectId: string,
    startDate: string,
    endDate: string,
  ): Promise<TeamPerformanceMetric[]> {
    // Fetch team members
    const membersResult = await databases.listDocuments(
      DATABASE_ID,
      "projectMembers",
      [Query.equal("projectId", projectId)],
    );

    const metrics: TeamPerformanceMetric[] = [];

    for (const member of membersResult.documents) {
      // Fetch completed tasks for this team member
      const tasksResult = await databases.listDocuments(
        DATABASE_ID,
        "tasks",
        [
          Query.equal("projectId", projectId),
          Query.equal("assigneeId", member.userId),
          Query.equal("status", "DONE"),
          Query.greaterThanEqual("$updatedAt", startDate),
          Query.lessThanEqual("$updatedAt", endDate),
        ],
      );

      // Calculate metrics (simplified)
      const completedTasks = tasksResult.documents.length;
      const averageCompletionTime = completedTasks > 0
        ? tasksResult.documents.reduce(
          (sum, task) => sum + (task.aiEstimatedHours || 4),
          0,
        ) / completedTasks
        : 0;

      // Calculate estimation accuracy (simplified)
      let estimationAccuracy = 0;
      if (completedTasks > 0) {
        const accuracySum = tasksResult.documents.reduce((sum, task) => {
          const estimated = task.aiEstimatedHours || 4;
          const actual = estimated; // In a real app, you'd use actual tracked time
          return sum + (1 - Math.abs(actual - estimated) / estimated);
        }, 0);
        estimationAccuracy = accuracySum / completedTasks;
      }

      metrics.push({
        userId: member.userId,
        completedTasks,
        averageCompletionTime,
        estimationAccuracy,
      });
    }

    return metrics;
  }

  /**
   * Calculate average completion time from team metrics
   */
  private calculateAverageCompletionTime(
    teamMetrics: TeamPerformanceMetric[],
  ): number {
    if (teamMetrics.length === 0) return 0;

    const totalCompletedTasks = teamMetrics.reduce(
      (sum, metric) => sum + metric.completedTasks,
      0,
    );
    if (totalCompletedTasks === 0) return 0;

    const weightedSum = teamMetrics.reduce(
      (sum, metric) =>
        sum + (metric.averageCompletionTime * metric.completedTasks),
      0,
    );

    return weightedSum / totalCompletedTasks;
  }

  /**
   * Analyze team performance
   */
  async analyzeTeamPerformance(
    projectId: string,
  ): Promise<TeamPerformanceMetric[]> {
    // Get current date
    const endDate = new Date().toISOString();

    // Get date 30 days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return this.generateTeamPerformanceMetrics(
      projectId,
      startDate.toISOString(),
      endDate,
    );
  }
}

// Export a singleton instance
export const aiService = new AIService();
