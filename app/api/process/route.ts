import { NextRequest, NextResponse } from 'next/server';
import { extractText } from '@/lib/extract';
import { parseResume, analyzeJob, generateOutputs } from '@/lib/claude';
import { createResumeDocx } from '@/lib/docx-export';
import { createResumePdf } from '@/lib/pdf-export';
import { Language, ProcessResponse } from '@/types';

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;
    const language = (formData.get('language') as Language) || 'en';
    const downloadFormat = formData.get('downloadFormat') as string | null;
    const resumeText = formData.get('resumeText') as string | null;

    // If we have resumeText and downloadFormat, it's a download request
    if (resumeText && downloadFormat) {
      const isRTL = language === 'he';

      if (downloadFormat === 'pdf') {
        const pdfBuffer = await createResumePdf(resumeText, isRTL);
        return new NextResponse(new Uint8Array(pdfBuffer), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="tailored-resume.pdf"',
          },
        });
      } else {
        const docxBuffer = await createResumeDocx(resumeText, isRTL);
        return new NextResponse(new Uint8Array(docxBuffer), {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': 'attachment; filename="tailored-resume.docx"',
          },
        });
      }
    }

    // Validate inputs for processing request
    if (!file) {
      return NextResponse.json<ProcessResponse>(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<ProcessResponse>(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json<ProcessResponse>(
        {
          success: false,
          error: 'Job description too short. Please provide more details.',
        },
        { status: 400 }
      );
    }

    // Extract text from file
    const buffer = Buffer.from(await file.arrayBuffer());
    const cvText = await extractText(buffer, file.name);

    if (!cvText || cvText.trim().length < 100) {
      return NextResponse.json<ProcessResponse>(
        {
          success: false,
          error: 'Could not extract enough text from the CV. Please check the file.',
        },
        { status: 400 }
      );
    }

    // Step 1: Parse resume
    const resumeJSON = await parseResume(cvText);

    // Step 2: Analyze job
    const jobJSON = await analyzeJob(jobDescription);

    // Step 3: Generate outputs
    const outputs = await generateOutputs(resumeJSON, jobJSON, language);

    return NextResponse.json<ProcessResponse>({
      success: true,
      data: outputs,
    });
  } catch (error) {
    console.error('Processing error:', error);
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json<ProcessResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
