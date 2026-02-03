# CV Snap - MVP Implementation Plan

## Product Overview

**CV Snap** helps job seekers tailor their resume to specific job descriptions. Upload a CV, paste a job description, and receive:
1. A tailored resume optimized for the role
2. Strengthened bullet points with before/after comparisons
3. A LinkedIn About section

**Key Constraint**: All outputs based ONLY on user's actual CV data. Never invent facts.

---

## 1. Product Goals

- **Primary**: Help users quickly tailor their CV to a specific job posting
- **Secondary**: Improve resume bullet points with stronger action verbs and metrics
- **Tertiary**: Generate a professional LinkedIn About section
- **Quality**: ATS-friendly, concise, professional outputs
- **Integrity**: Zero hallucination - only use facts from the uploaded CV

---

## 2. User Flow

```
[Landing Page]
     │
     ▼
[Upload CV (PDF/DOCX)] ──► [Paste Job Description]
     │
     ▼
[Click "Snap Resume"]
     │
     ▼
[Processing Screen - 10-15 seconds]
     │
     ▼
[Results Page with 3 tabs]
     ├── Tailored Resume (Copy + Download DOCX)
     ├── Bullet Upgrades (Copy)
     └── LinkedIn About (Copy)
```

---

## 3. MVP Feature Set

| Feature | Priority | Complexity |
|---------|----------|------------|
| CV Upload (PDF/DOCX) | P0 | Medium |
| Text extraction from files | P0 | Medium |
| Job description text input | P0 | Low |
| Resume parsing to JSON | P0 | Medium |
| Job analysis to JSON | P0 | Low |
| Tailored resume generation | P0 | Medium |
| Bullet strengthening | P0 | Medium |
| LinkedIn About generation | P0 | Low |
| Copy to clipboard buttons | P0 | Low |
| Download as DOCX | P0 | Medium |
| Hebrew/English toggle | P0 | Low |
| RTL support for Hebrew | P0 | Low |
| Loading states | P0 | Low |
| Error handling | P0 | Low |

---

## 4. Non-Goals (Explicitly Out of Scope)

- User accounts / authentication
- Payment processing
- Resume templates marketplace
- Cover letter generation
- Interview coaching
- Resume builder/editor
- File storage persistence (stateless)
- Analytics/tracking
- Email notifications

---

## 5. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│  Next.js 14 (App Router) + Tailwind CSS             │
│  - Landing page with upload form                     │
│  - Processing state                                  │
│  - Results page with tabs                            │
│  - i18n context (EN/HE with RTL)                    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                 API Routes                           │
│  Next.js Route Handlers                              │
│  POST /api/process - Single endpoint for all        │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Processing Pipeline                     │
│  1. Extract text from PDF/DOCX                      │
│  2. Parse CV → ResumeJSON (LLM)                     │
│  3. Parse Job → JobJSON (LLM)                       │
│  4. Generate outputs (LLM)                          │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                 LLM Provider                         │
│  Anthropic Claude (claude-sonnet-4-20250514)               │
│  - Excellent instruction following                   │
│  - Strong at structured extraction                   │
│  - Reliable JSON output with proper prompting        │
└─────────────────────────────────────────────────────┘
```

**Why this architecture:**
- **Single API endpoint**: Simpler than 3 separate calls, reduces client complexity
- **Stateless**: No database needed, files processed in memory
- **Claude claude-sonnet-4-20250514**: Excellent instruction following, reliable structured extraction
- **Next.js App Router**: Modern, simple, deploys easily on Vercel

---

## 6. Data Models

### ResumeJSON (parsed from CV)

```typescript
interface ResumeJSON {
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
    endDate: string; // or "Present"
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
```

### JobJSON (parsed from job description)

```typescript
interface JobJSON {
  title: string;
  company?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  keywords: string[]; // ATS-relevant terms
}
```

### GenerationOutput

```typescript
interface GenerationOutput {
  tailoredResume: string;      // Full formatted resume text
  bulletUpgrades: {
    original: string;
    improved: string;
    context: string;           // Which role this belongs to
  }[];
  linkedinAbout: string;       // 200-250 words, first person
}
```

---

## 7. API Contract

### POST /api/process

**Request:**
```typescript
// FormData
{
  file: File;           // PDF or DOCX
  jobDescription: string;
  language: 'en' | 'he';
}
```

**Response (Success):**
```typescript
{
  success: true;
  data: {
    tailoredResume: string;
    bulletUpgrades: {
      original: string;
      improved: string;
      context: string;
    }[];
    linkedinAbout: string;
  }
}
```

**Response (Error):**
```typescript
{
  success: false;
  error: string;
}
```

---

## 8. Prompt Design

### Global System Prompt (used in all LLM calls)

```
You are a professional resume writer and career coach.

CRITICAL RULES:
1. NEVER invent information not present in the source data
2. NEVER add fake metrics, achievements, or experiences
3. If information is missing, keep it generic or omit it
4. Use professional, ATS-friendly language
5. Be concise - prefer shorter, impactful phrases
6. Maintain truthfulness above all else
```

### Prompt 1: CV Extraction

```
Extract information from this CV text into structured JSON.

RULES:
- Extract ONLY factual information present in the text
- Do not infer or add information not explicitly stated
- If a field is not found, use null or empty array
- Preserve exact company names, role titles, and dates
- Keep bullet points verbatim

CV TEXT:
{cv_text}

Return valid JSON matching this schema:
{ResumeJSON schema}
```

### Prompt 2: Job Analysis

```
Analyze this job description and extract key requirements.

JOB DESCRIPTION:
{job_text}

Return valid JSON matching this schema:
{JobJSON schema}

Focus on:
- Required vs preferred skills
- Key responsibilities
- ATS keywords (terms likely in resume screening)
```

### Prompt 3: Output Generation

```
You have a candidate's resume data and a job description analysis.
Generate tailored outputs for this job application.

RESUME DATA:
{ResumeJSON}

JOB REQUIREMENTS:
{JobJSON}

OUTPUT LANGUAGE: {language}

Generate exactly 3 outputs:

1. TAILORED RESUME
Format as plain text with clear sections.
- Reorder skills to prioritize job-relevant ones first
- Adjust summary to align with job requirements
- Keep all facts unchanged
- Use ATS-friendly formatting

2. BULLET UPGRADES
For each experience bullet:
- Original: [exact original text]
- Improved: [strengthened version with action verbs]
Only improve, never invent new achievements.

3. LINKEDIN ABOUT
- 200-250 words
- Professional first-person voice
- Highlight relevant experience for this type of role
- 3 short paragraphs

Return as JSON:
{
  "tailoredResume": "...",
  "bulletUpgrades": [...],
  "linkedinAbout": "..."
}
```

---

## 9. UI Layout

### Landing Page

```
┌─────────────────────────────────────────────────────┐
│  [EN/עב Toggle]                              [Logo] │
├─────────────────────────────────────────────────────┤
│                                                      │
│              CV Snap                                 │
│   Tailor your resume in seconds                     │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  📄 Upload your CV (PDF or DOCX)            │   │
│  │  [Drop file here or click to upload]        │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  📋 Paste Job Description                    │   │
│  │                                              │   │
│  │  [Large textarea]                            │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│         [ ✨ Snap My Resume ]                       │
│                                                      │
│  Simple • Fast • No data stored                     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Processing Screen

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│                    [Spinner]                         │
│                                                      │
│            Analyzing your resume...                  │
│                                                      │
│     Step 1: Extracting CV data          ✓           │
│     Step 2: Analyzing job requirements  ✓           │
│     Step 3: Generating outputs          ◉           │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Results Page

```
┌─────────────────────────────────────────────────────┐
│  [← Back]                                    [Logo] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [Tailored Resume] [Bullet Upgrades] [LinkedIn]     │
│  ─────────────────────────────────────────────      │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │                                              │   │
│  │  [Content area - scrollable]                 │   │
│  │                                              │   │
│  │                                              │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  [📋 Copy to Clipboard]  [📥 Download DOCX]         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Design System

| Element | Value |
|---------|-------|
| Background | White (#FFFFFF) |
| Text | Black (#000000) |
| Borders | Light gray (#E5E7EB) |
| Primary button | Black bg, white text |
| Secondary button | White bg, black border |
| Font | System font stack |
| Border radius | 8px |
| Spacing | 16px / 24px / 32px |
| Max width | 800px |

---

## 10. Execution Plan

### Phase 1: Project Setup & UI Skeleton
- [x] Initialize Next.js 14 project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up folder structure
- [x] Create i18n context (EN/HE + RTL)
- [x] Build landing page UI
- [x] Build results page UI (with tabs)
- [x] Add file upload component
- [x] Add job description textarea

### Phase 2: File Processing
- [x] Install pdfjs-dist and mammoth libraries
- [x] Create text extraction utility
- [ ] Test with sample PDF and DOCX files

### Phase 3: API & LLM Integration
- [x] Set up Anthropic SDK
- [x] Create /api/process endpoint
- [x] Implement CV parsing prompt
- [x] Implement job analysis prompt
- [x] Implement generation prompt
- [x] Add error handling and validation

### Phase 4: End-to-End Integration
- [x] Connect frontend to API
- [x] Add loading states with progress
- [x] Handle errors gracefully
- [ ] Test full flow

### Phase 5: Export & Polish
- [x] Install docx library
- [x] Create DOCX export function
- [x] Add copy-to-clipboard functionality
- [x] Final UI polish
- [ ] Test RTL Hebrew mode

### Phase 6: Deployment
- [x] Add environment variables (.env.example)
- [ ] Deploy to Vercel
- [x] Test production build

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14 App Router | Modern, simple, Vercel native |
| Styling | Tailwind CSS | Fast, consistent, RTL support |
| LLM | Claude claude-sonnet-4-20250514 | Excellent instruction following |
| PDF parsing | pdf-parse | Simple, no native deps |
| DOCX read | mammoth | Reliable text extraction |
| DOCX write | docx | Full control over output |
| i18n | Custom context | Simpler than next-intl for 2 languages |
| State | React useState | No need for complex state |
| File storage | Memory only | Stateless, no persistence |

---

## File Structure

```
cvsnap/
├── app/
│   ├── layout.tsx          # Root layout with i18n provider
│   ├── page.tsx            # Landing page
│   ├── results/
│   │   └── page.tsx        # Results page
│   ├── api/
│   │   └── process/
│   │       └── route.ts    # Main processing endpoint
│   └── globals.css         # Tailwind imports
├── components/
│   ├── FileUpload.tsx      # Drag & drop file upload
│   ├── JobInput.tsx        # Job description textarea
│   ├── LanguageToggle.tsx  # EN/HE switcher
│   ├── LoadingState.tsx    # Processing screen
│   ├── ResultTabs.tsx      # Tab navigation
│   └── CopyButton.tsx      # Copy to clipboard
├── lib/
│   ├── i18n.tsx            # i18n context & translations
│   ├── extract.ts          # PDF/DOCX text extraction
│   ├── prompts.ts          # LLM prompts
│   ├── claude.ts           # Anthropic client & calls
│   └── docx-export.ts      # DOCX generation
├── types/
│   └── index.ts            # TypeScript interfaces
├── public/
│   └── ...
├── .env.local              # OPENAI_API_KEY
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| LLM returns invalid JSON | Strong prompting, add fallback parsing |
| Large PDF fails extraction | Set file size limit (5MB) |
| Slow LLM response | Show progress steps, use streaming if needed |
| Hebrew text extraction issues | Test with Hebrew CVs early |
| Cost per request | Use Claude Haiku for parsing, Sonnet for generation |

---

## Approval Checklist

Before proceeding to implementation, please confirm:

- [x] Architecture approach is acceptable
- [x] Claude API as LLM provider (ANTHROPIC_API_KEY required)
- [ ] Single endpoint vs multiple endpoints preference
- [ ] File structure looks good
- [ ] UI layout matches expectations
- [ ] Any changes to scope or priorities?

---

## Questions for You

1. **File size limit**: Is 5MB reasonable for CV uploads?

2. **Streaming**: Should results stream in, or is waiting 10-15 seconds acceptable?

3. **Analytics**: Skip entirely for MVP, or add basic Vercel Analytics?

Please review and let me know if any adjustments needed before I begin implementation.
