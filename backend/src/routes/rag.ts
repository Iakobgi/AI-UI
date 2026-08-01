import { Router } from "express";
import multer from "multer";
import { processUpload } from "../services/fileProcessor";
import { queryRag } from "../services/embeddings";

const upload = multer({ dest: "uploads/" });
const router = Router();

// Upload document(s) for RAG
router.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    const files = (req.files || []) as Express.Multer.File[];
    const result = await processUpload(files);
    res.json({ ok: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || err });
  }
});

// Query RAG: { query, topK }
router.post("/query", async (req, res) => {
  const { query, topK = 4 } = req.body;
  try {
    const contexts = await queryRag(query, topK);
    res.json({ contexts });
  } catch (err: any) {
    res.status(500).json({ error: err.message || err });
  }
});

export default router;
