// Resume data structure extracted from CV
export interface ResumeJSON {
  personal: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    title: string;
    summary?: string;
    linkedin?: string;
  };
  skills: string[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field?: string;
    year?: string;
  }[];
  certifications?: string[];
  languages?: string[];
}

// Job description analysis
export interface JobJSON {
  title: string;
  company?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  keywords: string[];
}

// Bullet upgrade with before/after
export interface BulletUpgrade {
  original: string;
  improved: string;
  context: string;
}

// Change report summarizing what was modified
export interface ChangeReport {
  matchScore: number;
  summaryChanges: string;
  skillsReordered: string[];
  keywordsAdded: string[];
  bulletImprovements: number;
  overallNotes: string[];
}

// Final generation output
export interface GenerationOutput {
  tailoredResume: string;
  bulletUpgrades: BulletUpgrade[];
  linkedinAbout: string;
  changeReport: ChangeReport;
}

// API response
export interface ProcessResponse {
  success: boolean;
  data?: GenerationOutput;
  error?: string;
}

// Supported languages
export type Language = 'en' | 'he';
