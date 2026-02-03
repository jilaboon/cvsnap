import Anthropic from '@anthropic-ai/sdk';
import { ResumeJSON, JobJSON, GenerationOutput, Language } from '@/types';
import {
  SYSTEM_PROMPT,
  getCVExtractionPrompt,
  getJobAnalysisPrompt,
  getGenerationPrompt,
} from './prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Parse CV text into structured JSON
export async function parseResume(cvText: string): Promise<ResumeJSON> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: getCVExtractionPrompt(cvText),
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  try {
    return JSON.parse(content.text) as ResumeJSON;
  } catch {
    // Try to extract JSON from the response if it contains extra text
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ResumeJSON;
    }
    throw new Error('Failed to parse resume extraction response');
  }
}

// Analyze job description into structured JSON
export async function analyzeJob(jobText: string): Promise<JobJSON> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: getJobAnalysisPrompt(jobText),
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  try {
    return JSON.parse(content.text) as JobJSON;
  } catch {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as JobJSON;
    }
    throw new Error('Failed to parse job analysis response');
  }
}

// Generate all outputs: tailored resume, bullet upgrades, LinkedIn about
export async function generateOutputs(
  resumeJSON: ResumeJSON,
  jobJSON: JobJSON,
  language: Language
): Promise<GenerationOutput> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: getGenerationPrompt(
          JSON.stringify(resumeJSON, null, 2),
          JSON.stringify(jobJSON, null, 2),
          language
        ),
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  try {
    return JSON.parse(content.text) as GenerationOutput;
  } catch {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as GenerationOutput;
    }
    throw new Error('Failed to parse generation response');
  }
}
