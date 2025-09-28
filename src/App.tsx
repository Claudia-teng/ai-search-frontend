import { useRef, useState } from 'react'
import styles from './App.module.css'

const WS_URL = 'ws://localhost:8080/ws'

function App() {
  const [query, setQuery] = useState('')
  const [isSourcesLoading, setIsSourcesLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [sources, setSources] = useState<string[]>([])
  const [summary, setSummary] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null)

  function connectAndSend(q: string) {
    setIsSourcesLoading(true)
    setIsSummaryLoading(true)

    // Close any existing connection before reconnecting
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      wsRef.current.close()
    }
    setSources([])
    setSummary('')

    // Create new WebSocket connection
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    // Send query to server
    ws.onopen = () => {
      if (q.trim()) {
        ws.send(q.trim())
      }
    }

    // Handle incoming messages
    ws.onmessage = (event: MessageEvent) => {
      console.log('onmessage', JSON.parse(event.data))
      const data = JSON.parse(event.data)
      if (data.type === 'tool_response') {
        const urls = JSON.parse(data.content.content).urls
        setIsSourcesLoading(false)
        setSources(urls)
      } else if (data.type === 'stream') {
        setSummary((s) => s + data.content.content)
      } else if (data.type === 'terminate') {
        setIsSummaryLoading(false)
        ws.close()
      }
    }

    // Handle connection close
    ws.onclose = () => {
      wsRef.current = null
      setIsSourcesLoading(false)
      setIsSummaryLoading(false)
    }

    // Handle connection error
    ws.onerror = () => {}
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSourcesLoading(true)
    setIsSummaryLoading(true)
    connectAndSend(query)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>AI Search Assistant</h1>
        <p>Ask anything and get intelligent answers</p>
        <form className={styles.search} onSubmit={handleSubmit}>
          <input className={styles.searchInput} type='search' placeholder='Ask anything...' aria-label='Search' value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className={styles.searchButton} type='submit' disabled={isSummaryLoading || query.trim() === ''} aria-label='Submit search' title='Search'>
            {isSummaryLoading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </header>

      <main className={styles.content}>
        <div className={styles.thread}>
          {isSourcesLoading && <div className={styles.loader}></div>}
          {sources.length > 0 && (
            <div className={styles.message}>
              <div className={styles.messageTitle}>Sources</div>
              <div className={styles.sourceList}>
                {sources.map((url, i) => {
                  let label = url
                  try {
                    label = new URL(url).hostname.replace('www.', '')
                  } catch {
                    // Keep full URL if parsing fails
                  }
                  return (
                    <a key={`${url}-${i}`} className={styles.chip} href={url} target='_blank' rel='noreferrer' title={url}>
                      {label}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {summary && (
            <div className={styles.message}>
              <div className={styles.messageTitle}>Summary</div>
              <div className={styles.messageBody}>
                <p>{summary}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
