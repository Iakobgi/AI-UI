import fs from "fs";
import path from "path";
import pdfparse from "pdf-parse";
import { createEmbeddings } from "./embeddings";
import { upsertVectors } from "./vectorClient";

export async function processUpload(files: Express.Multer.File[]) {
  const results: any[] = [];
  for (const f of files) {
    const text = await extractTextFromFile(f.path, f.originalname);
    const chunks = chunkText(text || "", 800);
    const embeddings = await createEmbeddings(chunks);
    const records = chunks.map((c, i) => ({
      id: `${f.filename}_${i}`,
      embedding: embeddings[i],
      metadata: { source: f.originalname },
      text: c,
    }));
    await upsertVectors("default", records);
    results.push({ file: f.originalname, chunks: chunks.length });
    try { fs.unlinkSync(f.path); } catch {}
  }
  return results;
}

async function extractTextFromFile(filepath: string, filename: string) {
  const ext = path.extname(filename).toLowerCase();
  try {
    if (ext === ".json" || ext === ".txt") {
      return fs.readFileSync(filepath, "utf-8");
    }
    if (ext === ".pdf") {
      const data = fs.readFileSync(filepath);
      const parsed = await pdfparse(data);
      return parsed.text || "";
    }
  } catch (err) {
    console.warn("extractTextFromFile error:", err);
  }
  return `CONTENT_OF_${filename}`;
}

function chunkText(text: string, approxSize = 1000) {
  const out: string[] = [];
  let i = 0;
  while (i < text.length) {
    out.push(text.slice(i, i + approxSize));
    i += approxSize;
  }
  return out;
}
