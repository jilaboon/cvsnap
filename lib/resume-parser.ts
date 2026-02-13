export interface ResumeSection {
  section: string;
  content: string[];
}

// Parse resume text into sections for formatting.
// Section headers are detected as ALL-CAPS lines (3-29 chars, not starting with a bullet).
export function parseResumeText(text: string): ResumeSection[] {
  const lines = text.split('\n');
  const sections: ResumeSection[] = [];
  let currentSection: ResumeSection = { section: '', content: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isHeader = trimmed === trimmed.toUpperCase() &&
                     trimmed.length > 2 &&
                     trimmed.length < 30 &&
                     !trimmed.startsWith('-') &&
                     !trimmed.startsWith('•');

    if (isHeader) {
      if (currentSection.section || currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { section: trimmed, content: [] };
    } else {
      currentSection.content.push(trimmed);
    }
  }

  if (currentSection.section || currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}
