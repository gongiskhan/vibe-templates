import type { Agent, Integration, Run, StreamEvent } from './types'

export const mockAgents: Agent[] = [
  {
    id: 'agent_research',
    name: 'Research Agent',
    description: 'Conducts comprehensive research on any topic, synthesizes information from multiple sources, and provides detailed reports.',
    version: '1.2.0',
    tags: ['research', 'analysis', 'writing'],
    allowed_integrations: ['web_search', 'document_reader', 'slack'],
  },
  {
    id: 'agent_code_review',
    name: 'Code Review Agent',
    description: 'Reviews code for bugs, security issues, performance problems, and style violations. Provides actionable feedback.',
    version: '2.0.1',
    tags: ['code', 'review', 'security'],
    allowed_integrations: ['github', 'gitlab', 'slack'],
  },
  {
    id: 'agent_data_analysis',
    name: 'Data Analysis Agent',
    description: 'Analyzes datasets, generates visualizations, identifies trends, and produces statistical reports.',
    version: '1.5.3',
    tags: ['data', 'analytics', 'visualization'],
    allowed_integrations: ['database', 'spreadsheet', 'slack'],
  },
  {
    id: 'agent_content_writer',
    name: 'Content Writer Agent',
    description: 'Creates high-quality written content including blog posts, documentation, marketing copy, and more.',
    version: '3.1.0',
    tags: ['writing', 'content', 'marketing'],
    allowed_integrations: ['web_search', 'document_reader', 'cms'],
  },
  {
    id: 'agent_automation',
    name: 'Workflow Automation Agent',
    description: 'Automates repetitive tasks, integrates with various services, and orchestrates complex workflows.',
    version: '1.0.0',
    tags: ['automation', 'workflow', 'integration'],
    allowed_integrations: ['slack', 'email', 'calendar', 'github'],
  },
]

export const mockIntegrations: Integration[] = [
  {
    id: 'web_search',
    name: 'Web Search',
    description: 'Search the web for information and retrieve relevant content',
    status: 'active',
    capabilities: ['search', 'fetch_content', 'extract_data'],
    icon: 'search',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Access repositories, issues, pull requests, and code',
    status: 'active',
    capabilities: ['read_repos', 'read_issues', 'read_prs', 'create_issues', 'review_code'],
    icon: 'github',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages and notifications to Slack channels',
    status: 'active',
    capabilities: ['send_message', 'read_channels', 'upload_files'],
    icon: 'message-square',
  },
  {
    id: 'document_reader',
    name: 'Document Reader',
    description: 'Read and parse various document formats (PDF, Word, Excel)',
    status: 'active',
    capabilities: ['read_pdf', 'read_docx', 'read_xlsx', 'extract_text'],
    icon: 'file-text',
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Query and analyze data from connected databases',
    status: 'active',
    capabilities: ['query', 'aggregate', 'export'],
    icon: 'database',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send and receive emails',
    status: 'inactive',
    capabilities: ['send', 'read', 'search'],
    icon: 'mail',
  },
]

export const mockRuns: Run[] = [
  {
    run_id: 'run_abc123',
    agent_id: 'agent_research',
    status: 'completed',
    started_at: new Date(Date.now() - 3600000).toISOString(),
    finished_at: new Date(Date.now() - 3000000).toISOString(),
    progress: 100,
    result_summary: 'Completed research on AI trends in 2024. Generated comprehensive report with 15 sources.',
    artifacts: [
      { id: 'art_1', name: 'research_report.md', type: 'text/markdown', size: 45000 },
      { id: 'art_2', name: 'sources.json', type: 'application/json', size: 12000 },
    ],
    instructions: 'Research the latest AI trends and developments in 2024',
  },
  {
    run_id: 'run_def456',
    agent_id: 'agent_code_review',
    status: 'completed',
    started_at: new Date(Date.now() - 7200000).toISOString(),
    finished_at: new Date(Date.now() - 6600000).toISOString(),
    progress: 100,
    result_summary: 'Reviewed 12 files. Found 3 critical issues, 7 warnings, and 15 suggestions.',
    artifacts: [
      { id: 'art_3', name: 'review_report.md', type: 'text/markdown', size: 28000 },
    ],
    instructions: 'Review the authentication module for security issues',
  },
  {
    run_id: 'run_ghi789',
    agent_id: 'agent_data_analysis',
    status: 'failed',
    started_at: new Date(Date.now() - 1800000).toISOString(),
    finished_at: new Date(Date.now() - 1500000).toISOString(),
    progress: 45,
    error: 'Failed to connect to database: connection timeout',
    instructions: 'Analyze Q4 sales data and identify trends',
  },
  {
    run_id: 'run_jkl012',
    agent_id: 'agent_content_writer',
    status: 'running',
    started_at: new Date(Date.now() - 300000).toISOString(),
    progress: 67,
    instructions: 'Write a blog post about sustainable technology',
  },
]

export function generateMockStreamEvents(): StreamEvent[] {
  const now = Date.now()
  return [
    {
      type: 'log',
      timestamp: new Date(now).toISOString(),
      data: { message: 'Initializing agent...' },
    },
    {
      type: 'log',
      timestamp: new Date(now + 500).toISOString(),
      data: { message: 'Loading configuration and integrations...' },
    },
    {
      type: 'progress',
      timestamp: new Date(now + 1000).toISOString(),
      data: { progress: 10, message: 'Configuration loaded' },
    },
    {
      type: 'log',
      timestamp: new Date(now + 1500).toISOString(),
      data: { message: 'Parsing instructions...' },
    },
    {
      type: 'log',
      timestamp: new Date(now + 2000).toISOString(),
      data: { message: 'Processing input files...' },
    },
    {
      type: 'progress',
      timestamp: new Date(now + 2500).toISOString(),
      data: { progress: 25, message: 'Inputs processed' },
    },
    {
      type: 'output',
      timestamp: new Date(now + 3000).toISOString(),
      data: { output: '## Analysis Started\n\nBeginning comprehensive analysis of provided materials.\n\n' },
    },
    {
      type: 'log',
      timestamp: new Date(now + 3500).toISOString(),
      data: { message: 'Querying web search integration...' },
    },
    {
      type: 'progress',
      timestamp: new Date(now + 4000).toISOString(),
      data: { progress: 40, message: 'External data retrieved' },
    },
    {
      type: 'output',
      timestamp: new Date(now + 4500).toISOString(),
      data: { output: '### Key Findings\n\n1. **Finding One**: Initial observations indicate strong correlation between variables.\n\n' },
    },
    {
      type: 'log',
      timestamp: new Date(now + 5000).toISOString(),
      data: { message: 'Synthesizing information...' },
    },
    {
      type: 'progress',
      timestamp: new Date(now + 5500).toISOString(),
      data: { progress: 60, message: 'Synthesis in progress' },
    },
    {
      type: 'output',
      timestamp: new Date(now + 6000).toISOString(),
      data: { output: '2. **Finding Two**: Secondary analysis reveals additional patterns worth investigating.\n\n' },
    },
    {
      type: 'log',
      timestamp: new Date(now + 6500).toISOString(),
      data: { message: 'Generating visualizations...' },
    },
    {
      type: 'progress',
      timestamp: new Date(now + 7000).toISOString(),
      data: { progress: 80, message: 'Visualizations generated' },
    },
    {
      type: 'output',
      timestamp: new Date(now + 7500).toISOString(),
      data: { output: '3. **Finding Three**: Recommendations based on comprehensive data review.\n\n### Conclusion\n\nAnalysis complete. See artifacts for detailed reports.\n' },
    },
    {
      type: 'log',
      timestamp: new Date(now + 8000).toISOString(),
      data: { message: 'Finalizing artifacts...' },
    },
    {
      type: 'progress',
      timestamp: new Date(now + 8500).toISOString(),
      data: { progress: 95, message: 'Artifacts ready' },
    },
    {
      type: 'complete',
      timestamp: new Date(now + 9000).toISOString(),
      data: {
        message: 'Run completed successfully',
        result: {
          summary: 'Analysis completed successfully. Generated comprehensive report with 3 key findings and actionable recommendations.',
          artifacts: [
            { id: 'art_new_1', name: 'analysis_report.md', type: 'text/markdown', size: 32000 },
            { id: 'art_new_2', name: 'data_visualization.png', type: 'image/png', size: 156000 },
            { id: 'art_new_3', name: 'raw_data.json', type: 'application/json', size: 8500 },
          ],
        },
      },
    },
  ]
}
