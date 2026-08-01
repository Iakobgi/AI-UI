import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Playground() {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [includeRag, setIncludeRag] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => { fetchConnectors(); }, []);

  async function fetchConnectors() {
    const r = await axios.get("/api/connectors");
    setConnectors(r.data || []);
  }

  async function generate() {
    if (!selectedId) return alert("Select a connector");
    try {
      // optionally fetch RAG contexts if requested (demo)
      let prefix = "";
      if (includeRag) {
        const q = await axios.post("/api/rag/query", { query: prompt, topK: 3 });
        const contexts = q.data.contexts || [];
        prefix = contexts.map((c:any) => c.text).join("\n\n");
      }

      const fullPrompt = prefix ? `${prefix}\n\nUser prompt:\n${prompt}` : prompt;
      const r = await axios.post(`/api/connectors/${selectedId}/generate`, { prompt: fullPrompt });
      setResult(r.data);
    } catch (err:any) {
      setResult({ error: err?.response?.data || err.message });
    }
  }

  return (
    <div>
      <h2>Playground</h2>
      <div style={{ marginBottom: 8 }}>
        <label>Connector</label>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">-- select connector --</option>
          {connectors.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <textarea rows={6} style={{ width: "100%" }} placeholder="Prompt" value={prompt} onChange={e => setPrompt(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label><input type="checkbox" checked={includeRag} onChange={(e)=>setIncludeRag(e.target.checked)} /> Include RAG/PDF context</label>
      </div>

      <button onClick={generate}>Generate</button>

      <div style={{ marginTop: 12 }}>
        <h3>Result</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
        {result?.data?.url && (
          <div style={{ marginTop: 8 }}>
            {result.type === "image" && <img src={result.data.url} alt="generated" style={{ maxWidth: "100%" }} />}
            {result.type === "video" && <video src={result.data.url} controls style={{ maxWidth: "100%" }} />}
          </div>
        )}
      </div>
    </div>
  );
}
