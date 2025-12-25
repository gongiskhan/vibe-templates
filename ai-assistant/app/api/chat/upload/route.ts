import { NextRequest, NextResponse } from 'next/server';
import { saveUpload } from '@/lib/storage/uploads';
import { addMessage } from '@/lib/storage/sessions';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/chat/upload
 * Handle document uploads for vision processing
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sessionId = formData.get('sessionId') as string;

    // Validate input
    if (!file || !sessionId) {
      return NextResponse.json(
        { error: 'file and sessionId are required' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload an image or PDF.' },
        { status: 400 }
      );
    }

    console.log('[UPLOAD ROUTE] Processing upload:', {
      sessionId,
      filename: file.name,
      type: file.type,
      size: file.size
    });

    // Save the file
    const uploadedFile = await saveUpload(file, sessionId);

    // Add a message about the upload to the session
    await addMessage(
      sessionId,
      'user',
      `[Document uploaded: ${file.name}]`
    );

    console.log('[UPLOAD ROUTE] Upload saved:', {
      fileId: uploadedFile.id,
      path: uploadedFile.path
    });

    // For now, return success. Vision processing can be triggered separately.
    // The Maestric agent will handle vision processing when needed.
    return NextResponse.json({
      success: true,
      fileId: uploadedFile.id,
      filename: file.name,
      message: 'Document uploaded successfully. It will be processed when needed.'
    });

  } catch (error) {
    console.error('[UPLOAD ROUTE] Error:', error);

    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
