'use server';

import { feedOptimizationInsights as feedOptimizationInsightsFlow, type FeedOptimizationInsightsInput, type FeedOptimizationInsightsOutput } from '@/ai/flows/feed-optimization-insights';

export async function getFeedOptimizationInsights(input: FeedOptimizationInsightsInput): Promise<{ success: true; data: FeedOptimizationInsightsOutput } | { success: false; error: string; }> {
    try {
        const result = await feedOptimizationInsightsFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error getting feed optimization insights:", error);
        return { success: false, error: "An unexpected error occurred while generating insights. Please try again later." };
    }
}
