import mammoth from 'mammoth';

// Extract text from PDF buffer using pdf-parse
export async function extractFromPDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  return data.text.trim();
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
