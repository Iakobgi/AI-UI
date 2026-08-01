import React, { useEffect, useState } from "react";
import axios from "axios";

type NewConnector = {
  name: string;
  type: "llm" | "pdf" | "image" | "video";
  baseUrl?: string;
  apiKey?: string;
};

const TEMPLATES: Record<string, Partial<NewConnector>> = {
  openai: { type: "llm", name: "OpenAI (LLM)", baseUrl: "https://api.openai.com", apiKey: "" },
  pdflocal: { type: "pdf", name: "Local PDF Reader", baseUrl: "", apiKey: "" },
  replicate_image: { type: "image", name: "Replicate Image", baseUrl: "https://api.replicate.com", apiKey: "" },
  replicate_video: { type: "video", name: "Replicate Video", baseUrl: "https://api.replicate.com", apiKey: "" },
};

export default function Connectors() {
  const [list, setList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewConnector>({ name: "", type: "llm", baseUrl: "", apiKey: "" });

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    const r = await axios.get("/api/connectors");
    setList(r.data || []);
  }

  function openTemplate(key: string) {
    const t = TEMPLATES[key];
    setForm({ name: t.name || "", type: (t.type as any) || "llm", baseUrl: t.baseUrl || "", apiKey: t.apiKey || "" });
    setShowForm(true);
  }

  async function create() {
    await axios.post("/api/connectors", form);
    setForm({ name: "", type: "llm", baseUrl: "", apiKey: "" });
    setShowForm(false);
    fetchList();
  }

  return (
    <div>
      <h2>Connectors</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => openTemplate("openai")}>Add LLM</button>
        <button onClick={() => openTemplate("pdflocal")}>Add PDF Reader</button>
        <button onClick={() => openTemplate("replicate_image")}>Add Image Gen</button>
        <button onClick={() => openTemplate("replicate_video")}>Add Video Gen</button>
      </div>

      {showForm && (
        <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
          <div>
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
              <option value="llm">LLM</option>
              <option value="pdf">PDF Reader</option>
              <option value="image">Image Generator</option>
              <option value="video">Video Generator</option>
            </select>
          </div>
          <div>
            <label>Base URL</label>
            <input value={form.baseUrl} onChange={(e) => setForm({ ...form, baseUrl: e.target.value })} />
          </div>
          <div>
            <label>API Key</label>
            <input value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} />
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={create}>Save Connector</button>
            <button onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </div>
      )}

      <ul>
        {list.map((c:any) => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <strong>{c.name}</strong> <em>({c.type})</em> — <small>{c.id}</small>
            <div style={{ marginTop: 4 }}>
              <small>baseUrl: {c.baseUrl || "—"}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
