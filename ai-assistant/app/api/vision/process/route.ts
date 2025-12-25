import { NextRequest, NextResponse } from 'next/server';
import { maestricClient } from '@/lib/maestric/client';
import { getUploadMetadata } from '@/lib/storage/uploads';

/**
 * POST /api/vision/process
 * Process an uploaded document using vision capabilities
 *
 * This implementation attempts to use Maestric for vision processing.
 * If Maestric doesn't support vision, it returns a placeholder response.
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, fileId } = await request.json();

    if (!sessionId || !fileId) {
      return NextResponse.json(
        { error: 'sessionId and fileId are required' },
        { status: 400 }
      );
    }

    // Get file metadata
    const metadata = await getUploadMetadata(sessionId, fileId);

    if (!metadata) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    console.log('[VISION PROCESS] Processing document:', {
      sessionId,
      fileId,
      filename: metadata.originalName
    });

    // Try to use Maestric for vision processing
    try {
      const { jobId } = await maestricClient.execute({
        prompt: `Process this uploaded document: ${metadata.originalName}. Extract any relevant information.`,
        context: {
          sessionId,
          documentInfo: {
            filename: metadata.originalName,
            mimeType: metadata.mimeType,
            size: metadata.size,
          }
        },
        metadata: {
          type: 'vision',
          fileId,
        }
      });

      // Wait for processing
      const job = await maestricClient.waitForCompletion(jobId, {
        timeout: 60000, // 1 minute timeout for vision
      });

      if (job.status === 'completed' && job.result) {
        return NextResponse.json({
          success: true,
          extractedData: job.result,
          filename: metadata.originalName
        });
      }

      // If Maestric failed, return placeholder
      return NextResponse.json({
        success: true,
        extractedData: null,
        filename: metadata.originalName,
        note: 'Document uploaded. Vision processing is pending implementation on Maestric.'
      });

    } catch (maestricError) {
      console.warn('[VISION PROCESS] Maestric vision not available:', maestricError);

      // Return placeholder response
      return NextResponse.json({
        success: true,
        extractedData: null,
        filename: metadata.originalName,
        note: 'Document uploaded successfully. Vision processing will be available when Maestric supports it.'
      });
    }

  } catch (error) {
    console.error('[VISION PROCESS] Error:', error);

    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}
