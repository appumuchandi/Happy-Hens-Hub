'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing feed optimization insights based on egg yield and feed data.
 *
 * - feedOptimizationInsights - A function that initiates the feed optimization analysis.
 * - FeedOptimizationInsightsInput - The input type for the feedOptimizationInsights function.
 * - FeedOptimizationInsightsOutput - The return type for the feedOptimizationInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FeedOptimizationInsightsInputSchema = z.object({
  eggYieldData: z
    .array(z.object({
      date: z.string().describe('The date of the egg yield data.'),
      eggCount: z.number().describe('The number of eggs collected on the date.'),
    }))
    .describe('An array of egg yield data for the past 7 days.'),
  feedData: z
    .array(z.object({
      date: z.string().describe('The date of the feed data.'),
      feedConsumption: z.number().describe('The amount of feed consumed on the date (in kg).'),
    }))
    .describe('An array of feed consumption data for the past 7 days.'),
});
export type FeedOptimizationInsightsInput = z.infer<typeof FeedOptimizationInsightsInputSchema>;

const FeedOptimizationInsightsOutputSchema = z.object({
  insights: z
    .array(z.string())
    .describe('Actionable insights and recommendations for optimizing feed to improve egg production efficiency.'),
  anomalies: z
    .array(z.string())
    .describe('Detected anomalies in egg yield and feed data.'),
  seasonalRecommendations: z
    .array(z.string())
    .describe('Seasonal recommendations for optimizing feed.'),
});
export type FeedOptimizationInsightsOutput = z.infer<typeof FeedOptimizationInsightsOutputSchema>;

export async function feedOptimizationInsights(input: FeedOptimizationInsightsInput): Promise<FeedOptimizationInsightsOutput> {
  return feedOptimizationInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'feedOptimizationInsightsPrompt',
  input: {schema: FeedOptimizationInsightsInputSchema},
  output: {schema: FeedOptimizationInsightsOutputSchema},
  prompt: `You are an expert in poultry farming, specializing in feed optimization for egg production.

  Analyze the following data for the past 7 days to provide actionable insights and recommendations for optimizing feed to improve egg production efficiency.

  Egg Yield Data:
  {{#each eggYieldData}}
  - Date: {{date}}, Egg Count: {{eggCount}}
  {{/each}}

  Feed Consumption Data:
  {{#each feedData}}
  - Date: {{date}}, Feed Consumption: {{feedConsumption}} kg
  {{/each}}

  Provide the insights, anomalies detected, and seasonal recommendations based on the data provided. Use a numbered list for each.

  Output format:
  {
    "insights": ["Insight 1", "Insight 2", ...],
    "anomalies": ["Anomaly 1", "Anomaly 2", ...],
    "seasonalRecommendations": ["Recommendation 1", "Recommendation 2", ...]
  }
  `,
});

const feedOptimizationInsightsFlow = ai.defineFlow(
  {
    name: 'feedOptimizationInsightsFlow',
    inputSchema: FeedOptimizationInsightsInputSchema,
    outputSchema: FeedOptimizationInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
