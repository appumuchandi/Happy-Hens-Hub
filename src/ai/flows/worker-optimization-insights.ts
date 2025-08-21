'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing worker optimization insights based on egg collection data.
 *
 * - workerOptimizationInsights - A function that initiates the worker optimization analysis.
 * - WorkerOptimizationInsightsInput - The input type for the workerOptimizationInsights function.
 * - WorkerOptimizationInsightsOutput - The return type for the workerOptimizationInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkerOptimizationInsightsInputSchema = z.object({
  eggCollectionData: z
    .array(z.object({
        date: z.string().describe('The date of the egg collection.'),
        quantity: z.number().describe('The number of eggs collected.'),
        collector: z.string().describe('The name of the worker who collected the eggs.'),
    }))
    .describe('An array of egg collection data for the past 30 days.'),
});
export type WorkerOptimizationInsightsInput = z.infer<typeof WorkerOptimizationInsightsInputSchema>;

const WorkerOptimizationInsightsOutputSchema = z.object({
  productivityInsights: z
    .array(z.string())
    .describe('Insights on worker productivity, highlighting top performers and trends.'),
  consistencyAnalysis: z
    .array(z.string())
    .describe('Analysis of worker consistency and any detected anomalies in collection patterns.'),
  recommendations: z
    .array(z.string())
    .describe('Actionable recommendations for improving overall team efficiency and addressing issues.'),
});
export type WorkerOptimizationInsightsOutput = z.infer<typeof WorkerOptimizationInsightsOutputSchema>;

export async function workerOptimizationInsights(input: WorkerOptimizationInsightsInput): Promise<WorkerOptimizationInsightsOutput> {
  return workerOptimizationInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'workerOptimizationInsightsPrompt',
  input: {schema: WorkerOptimizationInsightsInputSchema},
  output: {schema: WorkerOptimizationInsightsOutputSchema},
  prompt: `You are an expert in farm management, specializing in workforce optimization for poultry farms.

  Analyze the following egg collection data for the past 30 days to provide actionable insights on worker performance.

  Egg Collection Data:
  {{#each eggCollectionData}}
  - Date: {{date}}, Collector: {{collector}}, Quantity: {{quantity}}
  {{/each}}

  Based on the data, provide:
  1.  **Productivity Insights**: Identify top-performing workers, compare productivity, and note any significant trends (e.g., a worker's performance increasing or decreasing over time).
  2.  **Consistency Analysis**: Analyze the consistency of each worker. Point out any anomalies, such as sudden drops or spikes in collection numbers for a specific worker.
  3.  **Actionable Recommendations**: Suggest concrete actions to improve team efficiency, recognize high-performers, or address any potential issues uncovered in the analysis.

  Output format:
  {
    "productivityInsights": ["Insight 1", "Insight 2", ...],
    "consistencyAnalysis": ["Analysis 1", "Analysis 2", ...],
    "recommendations": ["Recommendation 1", "Recommendation 2", ...]
  }
  `,
});

const workerOptimizationInsightsFlow = ai.defineFlow(
  {
    name: 'workerOptimizationInsightsFlow',
    inputSchema: WorkerOptimizationInsightsInputSchema,
    outputSchema: WorkerOptimizationInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
