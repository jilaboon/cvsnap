import { Language } from '@/types';

// System prompt used across all LLM calls
export const SYSTEM_PROMPT = `You are a professional resume writer and career coach.

CRITICAL RULES:
1. NEVER invent information not present in the source data
2. NEVER add fake metrics, achievements, or experiences
3. If information is missing, keep it generic or omit it
4. Use professional, ATS-friendly language
5. Be concise - prefer shorter, impactful phrases
6. Maintain truthfulness above all else`;

// Prompt for extracting structured data from CV text
export function getCVExtractionPrompt(cvText: string): string {
  return `Extract information from this CV text into structured JSON.

RULES:
- Extract ONLY factual information present in the text
- Do not infer or add information not explicitly stated
- If a field is not found, use null or empty array
- Preserve exact company names, role titles, and dates
- Keep bullet points verbatim

CV TEXT:
${cvText}

Return valid JSON matching this exact schema:
{
  "personal": {
    "name": "string",
    "email": "string or null",
    "phone": "string or null",
    "location": "string or null",
    "title": "string",
    "summary": "string or null",
    "linkedin": "string or null"
  },
  "skills": ["array of strings"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string or Present",
      "bullets": ["array of strings"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string or null",
      "year": "string or null"
    }
  ],
  "certifications": ["array of strings or null"],
  "languages": ["array of strings or null"]
}

Return ONLY the JSON, no other text.`;
}

// Prompt for analyzing job description
export function getJobAnalysisPrompt(jobText: string): string {
  return `Analyze this job description and extract key requirements.

JOB DESCRIPTION:
${jobText}

Return valid JSON matching this exact schema:
{
  "title": "string",
  "company": "string or null",
  "requiredSkills": ["array of must-have skills"],
  "preferredSkills": ["array of nice-to-have skills"],
  "responsibilities": ["array of key responsibilities"],
  "keywords": ["array of ATS-relevant terms likely used in resume screening"]
}

Focus on:
- Distinguishing required vs preferred skills
- Key responsibilities the role involves
- ATS keywords (technical terms, tools, methodologies)

Return ONLY the JSON, no other text.`;
}

// Prompt for generating all outputs
export function getGenerationPrompt(
  resumeJSON: string,
  jobJSON: string,
  language: Language
): string {
  const langInstruction =
    language === 'he'
      ? 'Generate ALL outputs in Hebrew. Use professional Hebrew business language.'
      : 'Generate ALL outputs in English.';

  return `You have a candidate's resume data and a job description analysis.
Generate tailored outputs for this job application.

${langInstruction}

RESUME DATA:
${resumeJSON}

JOB REQUIREMENTS:
${jobJSON}

Generate exactly 4 outputs:

1. TAILORED RESUME (tailoredResume)
- Format as plain text with clear sections: NAME, TITLE, SUMMARY, SKILLS, EXPERIENCE, EDUCATION
- Reorder skills to prioritize job-relevant ones first
- Adjust summary to align with job requirements
- Keep ALL facts unchanged - do not invent anything
- Use ATS-friendly formatting (no special characters, clear headers)
- For each experience entry, show: Company | Role | Start - End, then bullet points

2. BULLET UPGRADES (bulletUpgrades)
- For EACH experience bullet in the resume, create an upgrade
- Each upgrade must have: original (exact text from resume), improved (strengthened version), context (which company/role)
- Improve bullets using: stronger action verbs, quantified impact where data exists, clearer achievements
- NEVER invent metrics or achievements not in the original
- If the original bullet is already strong, make only minor improvements

3. LINKEDIN ABOUT (linkedinAbout)
- 200-250 words
- Professional first-person voice ("I am..." / "With X years...")
- Highlight experience relevant to the target job type
- 3 short paragraphs: intro/current role, key achievements/expertise, what you're looking for
- Based ONLY on facts from the resume

4. CHANGE REPORT (changeReport)
A detailed summary of all changes made to optimize the resume. Include:
- matchScore: number 1-100 representing how well the original CV matches the job
- summaryChanges: string describing what was changed in the summary section
- skillsReordered: array of strings listing skills that were moved to top for relevance
- keywordsAdded: array of strings listing ATS keywords incorporated
- bulletImprovements: number count of bullets that were strengthened
- overallNotes: array of 3-5 short strings with key observations/recommendations

Return as JSON:
{
  "tailoredResume": "full formatted resume text",
  "bulletUpgrades": [
    {"original": "exact original text", "improved": "strengthened version", "context": "Company - Role"}
  ],
  "linkedinAbout": "full LinkedIn about text",
  "changeReport": {
    "matchScore": 75,
    "summaryChanges": "description of summary modifications",
    "skillsReordered": ["skill1", "skill2"],
    "keywordsAdded": ["keyword1", "keyword2"],
    "bulletImprovements": 8,
    "overallNotes": ["note1", "note2", "note3"]
  }
}

Return ONLY the JSON, no other text.`;
}
