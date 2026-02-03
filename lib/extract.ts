import mammoth from 'mammoth';
import { extractText as extractPdfText } from 'unpdf';

// Extract text from PDF buffer using unpdf (serverless-compatible)
export async function extractFromPDF(buffer: Buffer): Promise<string> {
  const { text } = await extractPdfText(new Uint8Array(buffer));
  return text.join('\n').trim();
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
