import axios from "axios";

export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  if (process.env.EMBEDDING_PROVIDER === "openai") {
    const key = process.env.OPENAI_API_KEY;
    const url = "https://api.openai.com/v1/embeddings";
    const out: number[][] = [];
    for (const t of texts) {
      const r = await axios.post(url, { input: t, model: "text-embedding-3-small" }, {
        headers: { Authorization: `Bearer ${key}` }
      });
      out.push(r.data.data[0].embedding);
    }
    return out;
  }
  // Mock
  return texts.map(() => Array(768).fill(0));
}

export async function queryRag(query: string, topK = 4) {
  // Demo returning placeholders
  return [
    { id: "ctx1", score: 0.97, text: "Example context 1" },
    { id: "ctx2", score: 0.93, text: "Example context 2" }
  ].slice(0, topK);
}
