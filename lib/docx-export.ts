import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TabStopType,
  TabStopPosition,
} from 'docx';

// Parse resume text into sections
function parseResumeText(text: string): { section: string; content: string[] }[] {
  const lines = text.split('\n');
  const sections: { section: string; content: string[] }[] = [];
  let currentSection = { section: '', content: [] as string[] };

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

export async function createResumeDocx(
  resumeText: string,
  isRTL: boolean = false
): Promise<Buffer> {
  const sections = parseResumeText(resumeText);
  const paragraphs: Paragraph[] = [];
  const alignment = isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT;

  // Colors
  const primaryColor = '4f46e5';

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (i === 0 && !section.section) {
      // Name and title section
      const nameAndTitle = section.content.slice(0, 2);
      const rest = section.content.slice(2);

      if (nameAndTitle[0]) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: nameAndTitle[0],
                bold: true,
                size: 48, // 24pt
                color: '1f2937',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
          })
        );
      }
      if (nameAndTitle[1]) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: nameAndTitle[1],
                size: 28, // 14pt
                color: primaryColor,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
          })
        );
      }
      if (rest.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: rest.join(' | '),
                size: 20, // 10pt
                color: '6b7280',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          })
        );
      }
    } else {
      // Section with header
      if (section.section) {
        // Add spacing before section
        paragraphs.push(
          new Paragraph({
            text: '',
            spacing: { before: 200 },
          })
        );

        // Section header with bottom border
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.section,
                bold: true,
                size: 24, // 12pt
                color: primaryColor,
              }),
            ],
            alignment,
            border: {
              bottom: {
                color: 'e5e7eb',
                size: 8,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { after: 120 },
          })
        );
      }

      // Section content
      for (const line of section.content) {
        const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
        const isJobHeader = line.includes(' | ') && !isBullet;

        if (isBullet) {
          const bulletText = line.replace(/^[-•*]\s*/, '');
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${bulletText}`,
                  size: 20, // 10pt
                  color: '1f2937',
                }),
              ],
              alignment,
              indent: { left: 240 },
              spacing: { before: 40, after: 40 },
            })
          );
        } else if (isJobHeader) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  bold: true,
                  size: 22, // 11pt
                  color: '1f2937',
                }),
              ],
              alignment,
              spacing: { before: 160, after: 80 },
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: 20, // 10pt
                  color: '374151',
                }),
              ],
              alignment,
              spacing: { before: 40, after: 40 },
            })
          );
        }
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
