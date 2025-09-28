import { useRef, useState } from 'react'
import './App.css'

const WS_URL = 'ws://localhost:8080/ws'

function App() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [sources, setSources] = useState<string[]>([])
  const [summary, setSummary] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null)

  function connectAndSend(q: string) {
    setIsSearching(true)

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
        setSources(urls)
        setIsSearching(false)
      } else if (data.type === 'stream') {
        setSummary((s) => s + data.content.content)
      }
    }

    // Handle connection close
    ws.onclose = () => {
      wsRef.current = null
      setIsSearching(false)
    }

    // Handle connection error
    ws.onerror = () => {}
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSearching(true)
    connectAndSend(query)
  }

  return (
    <div className='app'>
      <header className='header'>
        <h1>AI Search Assistant</h1>
        <p>Ask anything and get intelligent answers</p>
        <form className='search' onSubmit={handleSubmit}>
          <input className='search-input' type='search' placeholder='Ask anything...' aria-label='Search' value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className='search-button' type='submit' disabled={isSearching || query.trim() === ''} aria-label='Submit search' title='Search'>
            {isSearching ? 'Searching…' : 'Search'}
          </button>
        </form>
      </header>

      <main className='content'>
        <div className='thread'>
          {isSearching && <div className='loader'></div>}
          {sources.length > 0 && (
            <div className='message sources'>
              <div className='message-title'>Sources</div>
              <div className='source-list'>
                {sources.map((url, i) => {
                  let label = url
                  try {
                    label = new URL(url).hostname.replace('www.', '')
                  } catch {
                    // Keep full URL if parsing fails
                  }
                  return (
                    <a key={`${url}-${i}`} className='chip' href={url} target='_blank' rel='noreferrer' title={url}>
                      {label}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {summary && (
            <div className='message summary'>
              <div className='message-title'>Summary</div>
              <div className='message-body'>
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
