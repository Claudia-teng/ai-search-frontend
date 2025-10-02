import { useRef, useState } from "react";
import styles from "./Search.module.css";
import SearchInput from "../../components/SearchInput/SearchInput";

import Card from "../../components/Card/Card";
import Chip from "../../components/Chip/Chip";

const WS_URL = import.meta.env.VITE_WS_URL;

function Sources({ sources }: { sources: string[] }) {
  return (
    <>
      {sources.length > 0 && (
        <Card>
          <div className={styles.sourceList}>
            {sources.map((url: string, i: number) => {
              let label = url;
              label = new URL(url).hostname.replace("www.", "");
              return <Chip key={`${url}-${i}`} url={url} label={label} />;
            })}
          </div>
        </Card>
      )}
    </>
  );
}

function Summary({ summary }: { summary: string }) {
  return (
    <>
      {summary && (
        <Card>
          <p>{summary}</p>
        </Card>
      )}
    </>
  );
}

function Search() {
  const [query, setQuery] = useState("");
  const [isSourcesLoading, setIsSourcesLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  function connectAndSend(q: string) {
    setIsSourcesLoading(true);
    setIsSummaryLoading(true);

    // Close any existing connection before reconnecting
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      wsRef.current.close();
    }
    setSources([]);
    setSummary("");

    // Create new WebSocket connection
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    // Send query to server
    ws.onopen = () => {
      if (q.trim()) {
        ws.send(q.trim());
      }
    };

    // Handle incoming messages
    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "tool_response") {
        const urls = JSON.parse(data.content.content).urls;
        setIsSourcesLoading(false);
        setSources(urls);
      } else if (data.type === "stream") {
        setSummary((s) => s + data.content.content);
      } else if (data.type === "terminate") {
        setIsSummaryLoading(false);
        ws.close();
      }
    };

    // Handle connection close
    ws.onclose = () => {
      wsRef.current = null;
      setIsSourcesLoading(false);
      setIsSummaryLoading(false);
    };

    // Handle connection error
    ws.onerror = () => {};
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSourcesLoading(true);
    setIsSummaryLoading(true);
    connectAndSend(query);
  }

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>AI Search Assistant</h1>
        <p>Ask anything and get intelligent answers</p>
        <SearchInput
          query={query}
          isLoading={isSummaryLoading}
          onHandleSubmit={handleSubmit}
          onHandleSearchInputChange={handleSearchInputChange}
        />
      </header>

      <main className={styles.content}>
        <div className={styles.thread}>
          {isSourcesLoading && <div className={styles.loader}></div>}
          <Sources sources={sources} />
          <Summary summary={summary} />
        </div>
      </main>
    </div>
  );
}

export default Search;
