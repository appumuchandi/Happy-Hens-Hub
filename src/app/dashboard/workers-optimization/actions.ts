'use server';

import { workerOptimizationInsights as workerOptimizationInsightsFlow, type WorkerOptimizationInsightsInput, type WorkerOptimizationInsightsOutput } from '@/ai/flows/worker-optimization-insights';

export async function getWorkerOptimizationInsights(input: WorkerOptimizationInsightsInput): Promise<{ success: true; data: WorkerOptimizationInsightsOutput } | { success: false; error: string; }> {
    try {
        const result = await workerOptimizationInsightsFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error getting worker optimization insights:", error);
        return { success: false, error: "An unexpected error occurred while generating insights. Please try again later." };
    }
}
