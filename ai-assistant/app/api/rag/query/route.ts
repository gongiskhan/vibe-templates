import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'data', 'docs');

/**
 * POST /api/rag/query
 * Query the knowledge base for relevant information
 *
 * Note: This is a simplified implementation that does basic text matching.
 * For production use with large document sets, implement proper vector search
 * using LanceDB and embeddings from @xenova/transformers.
 */
export async function POST(request: NextRequest) {
  try {
    const { question, maxSources = 3 } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'question is required' },
        { status: 400 }
      );
    }

    console.log('[RAG QUERY] Searching for:', question);

    // Load all documents from the docs directory
    const sources: Array<{
      filename: string;
      content: string;
      relevance: number;
    }> = [];

    try {
      const files = await fs.readdir(DOCS_DIR);
      const docFiles = files.filter(f =>
        f.endsWith('.md') || f.endsWith('.txt') || f.endsWith('.json')
      );

      // Simple keyword matching for now
      const keywords = question.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);

      for (const filename of docFiles) {
        const filePath = path.join(DOCS_DIR, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const lowerContent = content.toLowerCase();

        // Calculate simple relevance score based on keyword matches
        let relevance = 0;
        for (const keyword of keywords) {
          if (lowerContent.includes(keyword)) {
            relevance += (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
          }
        }

        if (relevance > 0) {
          sources.push({
            filename,
            content: content.slice(0, 500) + (content.length > 500 ? '...' : ''),
            relevance
          });
        }
      }

      // Sort by relevance and take top N
      sources.sort((a, b) => b.relevance - a.relevance);
      const topSources = sources.slice(0, maxSources);

      return NextResponse.json({
        question,
        sources: topSources,
        totalMatches: sources.length
      });

    } catch (dirError) {
      // No docs directory or empty
      return NextResponse.json({
        question,
        sources: [],
        totalMatches: 0,
        note: 'No documents found. Add documents to data/docs/ directory.'
      });
    }

  } catch (error) {
    console.error('[RAG QUERY] Error:', error);

    return NextResponse.json(
      { error: 'Failed to query knowledge base' },
      { status: 500 }
    );
  }
}
