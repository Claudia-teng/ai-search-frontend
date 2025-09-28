import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Placeholder data for layout only
  const [sources] = useState<string[]>([
    'https://en.wikipedia.org/wiki/Perplexity_AI',
    'https://news.ycombinator.com/',
    'https://example.com/article',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  ])
  const [summary] = useState<string>(
    'This is a placeholder summary. When your WebSocket streams tokens, render them here in this area. Keep this concise, factual, and organized with short paragraphs or bullet points.'
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSearching(true)
    // No backend integration yet—this just shows the disabled state briefly.
    window.setTimeout(() => setIsSearching(false), 800)
  }

  return (
    <div className='app'>
      <header className='header'>
        <form className='search' onSubmit={handleSubmit}>
          <input className='search-input' type='search' placeholder='Ask anything...' aria-label='Search' value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className='search-button' type='submit' disabled={isSearching || query.trim() === ''} aria-label='Submit search' title='Search'>
            {isSearching ? 'Searching…' : 'Search'}
          </button>
        </form>
      </header>

      <main className='content'>
        <div className='thread'>
          <div className='message sources'>
            <div className='message-title'>Sources</div>
            <div className='source-list'>
              {sources.slice(0, 4).map((url, i) => {
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

          <div className='message summary'>
            <div className='message-title'>Summary</div>
            <div className='message-body'>
              <p>{summary}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
