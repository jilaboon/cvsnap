import { jsPDF } from 'jspdf';

// Parse resume text into sections for better formatting
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

export async function createResumePdf(
  resumeText: string,
  _isRTL: boolean = false
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  const primaryColor: [number, number, number] = [79, 70, 229]; // indigo-600
  const textColor: [number, number, number] = [31, 41, 55]; // gray-800
  const lightGray: [number, number, number] = [107, 114, 128]; // gray-500

  const sections = parseResumeText(resumeText);

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (i === 0 && !section.section) {
      // Header section (name, title, contact)
      const nameAndTitle = section.content.slice(0, 2);
      const rest = section.content.slice(2);

      if (nameAndTitle[0]) {
        checkPageBreak(12);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...textColor);
        doc.text(nameAndTitle[0], pageWidth / 2, y, { align: 'center' });
        y += 8;
      }

      if (nameAndTitle[1]) {
        checkPageBreak(8);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...primaryColor);
        doc.text(nameAndTitle[1], pageWidth / 2, y, { align: 'center' });
        y += 6;
      }

      if (rest.length > 0) {
        checkPageBreak(8);
        doc.setFontSize(9);
        doc.setTextColor(...lightGray);
        const contactText = rest.join(' | ');
        const lines = doc.splitTextToSize(contactText, contentWidth);
        doc.text(lines, pageWidth / 2, y, { align: 'center' });
        y += lines.length * 4 + 8;
      }
    } else {
      // Regular section
      if (section.section) {
        checkPageBreak(14);
        y += 6;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text(section.section, margin, y);
        y += 2;

        // Divider line
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
      }

      // Section content
      for (const line of section.content) {
        const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
        const isJobHeader = line.includes(' | ') && !isBullet;

        if (isBullet) {
          const bulletText = '• ' + line.replace(/^[-•*]\s*/, '');
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...textColor);
          const lines = doc.splitTextToSize(bulletText, contentWidth - 8);
          checkPageBreak(lines.length * 4 + 2);
          doc.text(lines, margin + 4, y);
          y += lines.length * 4 + 1;
        } else if (isJobHeader) {
          checkPageBreak(8);
          y += 3;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...textColor);
          const lines = doc.splitTextToSize(line, contentWidth);
          doc.text(lines, margin, y);
          y += lines.length * 4 + 2;
        } else {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...textColor);
          const lines = doc.splitTextToSize(line, contentWidth);
          checkPageBreak(lines.length * 4 + 2);
          doc.text(lines, margin, y);
          y += lines.length * 4 + 1;
        }
      }
    }
  }

  // Return as Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
