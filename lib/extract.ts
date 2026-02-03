import mammoth from 'mammoth';

// Extract text from PDF buffer
export async function extractFromPDF(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid bundling issues
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  // Disable worker for serverless environment
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';

  const data = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

// Extract text from DOCX buffer
export async function extractFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// Main extraction function - detects file type and extracts
export async function extractText(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const extension = filename.toLowerCase().split('.').pop();

  if (extension === 'pdf') {
    return extractFromPDF(buffer);
  } else if (extension === 'docx' || extension === 'doc') {
    return extractFromDOCX(buffer);
  } else {
    throw new Error('Unsupported file type. Please upload PDF or DOCX.');
  }
}
