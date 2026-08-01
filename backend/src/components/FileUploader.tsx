import React, { useState } from "react";
import axios from "axios";

export default function FileUploader() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [resp, setResp] = useState<any>(null);

  async function upload() {
    if (!files || files.length === 0) return;
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append("files", f));
    const r = await axios.post("/api/rag/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    setResp(r.data);
  }

  return (
    <div>
      <h3>Upload for RAG</h3>
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      <button onClick={upload}>Upload</button>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(resp, null, 2)}</pre>
    </div>
  );
}
