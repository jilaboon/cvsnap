/* eslint-disable @typescript-eslint/no-explicit-any */
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';

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
  // Dynamic imports to avoid issues with serverless
  const pdfMakeModule = await import('pdfmake/build/pdfmake');
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts');

  const pdfMake = (pdfMakeModule.default || pdfMakeModule) as any;
  const pdfFonts = (pdfFontsModule.default || pdfFontsModule) as any;

  // Set up virtual file system for fonts
  if (pdfFonts.pdfMake) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else if (pdfFonts.vfs) {
    pdfMake.vfs = pdfFonts.vfs;
  }

  const sections = parseResumeText(resumeText);
  const content: Content[] = [];

  const primaryColor = '#4f46e5';
  const textColor = '#1f2937';
  const lightGray = '#6b7280';

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (i === 0 && !section.section) {
      const nameAndTitle = section.content.slice(0, 2);
      const rest = section.content.slice(2);

      if (nameAndTitle[0]) {
        content.push({
          text: nameAndTitle[0],
          fontSize: 24,
          bold: true,
          color: textColor,
          alignment: 'center',
          margin: [0, 0, 0, 4] as [number, number, number, number],
        });
      }
      if (nameAndTitle[1]) {
        content.push({
          text: nameAndTitle[1],
          fontSize: 14,
          color: primaryColor,
          alignment: 'center',
          margin: [0, 0, 0, 16] as [number, number, number, number],
        });
      }
      if (rest.length > 0) {
        content.push({
          text: rest.join(' '),
          fontSize: 10,
          color: lightGray,
          alignment: 'center',
          margin: [0, 0, 0, 20] as [number, number, number, number],
        });
      }
    } else {
      if (section.section) {
        content.push({
          text: section.section,
          fontSize: 12,
          bold: true,
          color: primaryColor,
          margin: [0, 16, 0, 8] as [number, number, number, number],
          alignment: 'left',
        });
        content.push({
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
              lineColor: '#e5e7eb',
            },
          ],
          margin: [0, 0, 0, 8] as [number, number, number, number],
        });
      }

      for (const line of section.content) {
        const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
        const isJobHeader = line.includes(' | ') && !isBullet;

        if (isBullet) {
          const bulletText = line.replace(/^[-•*]\s*/, '');
          content.push({
            text: `• ${bulletText}`,
            fontSize: 10,
            color: textColor,
            margin: [12, 2, 0, 2] as [number, number, number, number],
            alignment: 'left',
          });
        } else if (isJobHeader) {
          content.push({
            text: line,
            fontSize: 11,
            bold: true,
            color: textColor,
            margin: [0, 8, 0, 4] as [number, number, number, number],
            alignment: 'left',
          });
        } else {
          content.push({
            text: line,
            fontSize: 10,
            color: textColor,
            margin: [0, 2, 0, 2] as [number, number, number, number],
            alignment: 'left',
          });
        }
      }
    }
  }

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    content,
    defaultStyle: {
      font: 'Roboto'
    },
    info: {
      title: 'Tailored Resume',
      author: 'CV Snap',
    },
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBuffer((buffer: Uint8Array) => {
        resolve(Buffer.from(buffer));
      });
    } catch (error) {
      reject(error);
    }
  });
}
