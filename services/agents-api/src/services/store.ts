import * as fs from 'fs'
import * as path from 'path'
import type { Run, StreamEvent, Agent, Integration } from '../types/index.js'

const DATA_DIR = path.join(process.cwd(), 'data', 'runs')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

/**
 * Simple file-based store for runs
 */
export class RunStore {
  private runs: Map<string, Run> = new Map()
  private events: Map<string, StreamEvent[]> = new Map()

  async saveRun(run: Run): Promise<void> {
    this.runs.set(run.run_id, run)

    // Persist to file
    const filePath = path.join(DATA_DIR, `${run.run_id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(run, null, 2))
  }

  async getRun(runId: string): Promise<Run | null> {
    // Check memory first
    if (this.runs.has(runId)) {
      return this.runs.get(runId)!
    }

    // Try to load from file
    const filePath = path.join(DATA_DIR, `${runId}.json`)
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      this.runs.set(runId, data)
      return data
    }

    return null
  }

  async updateRun(runId: string, updates: Partial<Run>): Promise<Run | null> {
    const run = await this.getRun(runId)
    if (!run) return null

    const updated = { ...run, ...updates }
    await this.saveRun(updated)
    return updated
  }

  appendEvent(runId: string, event: StreamEvent): void {
    if (!this.events.has(runId)) {
      this.events.set(runId, [])
    }
    this.events.get(runId)!.push(event)
  }

  getEvents(runId: string): StreamEvent[] {
    return this.events.get(runId) || []
  }
}

/**
 * Mock agents data
 */
export const mockAgents: Agent[] = [
  {
    id: 'agent-research',
    name: 'Agente de Pesquisa',
    description: 'Realiza pesquisas detalhadas sobre qualquer tópico',
    version: '1.0.0',
    tags: ['pesquisa', 'análise', 'documentação'],
    capabilities: ['web_search', 'summarize', 'cite_sources'],
    allowed_integrations: ['web-search', 'doc-store']
  },
  {
    id: 'agent-code',
    name: 'Agente de Código',
    description: 'Gera, analisa e refatora código',
    version: '1.0.0',
    tags: ['código', 'desenvolvimento', 'review'],
    capabilities: ['generate_code', 'review_code', 'refactor'],
    allowed_integrations: ['github', 'gitlab']
  },
  {
    id: 'agent-data',
    name: 'Agente de Dados',
    description: 'Processa e analisa conjuntos de dados',
    version: '1.0.0',
    tags: ['dados', 'analytics', 'visualização'],
    capabilities: ['analyze_data', 'generate_charts', 'export'],
    allowed_integrations: ['database', 'spreadsheet']
  }
]

/**
 * Mock integrations data
 */
export const mockIntegrations: Integration[] = [
  {
    id: 'web-search',
    name: 'Busca na Web',
    description: 'Pesquisa informações na internet',
    status: 'active',
    capabilities: ['search', 'fetch_content']
  },
  {
    id: 'doc-store',
    name: 'Armazenamento de Documentos',
    description: 'Salva e recupera documentos',
    status: 'active',
    capabilities: ['store', 'retrieve', 'version']
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Integração com repositórios GitHub',
    status: 'active',
    capabilities: ['read_repos', 'create_pr', 'review']
  },
  {
    id: 'database',
    name: 'Banco de Dados',
    description: 'Conexão com banco de dados SQL',
    status: 'pending',
    capabilities: ['query', 'insert', 'update']
  }
]
