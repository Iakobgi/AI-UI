import { Router } from "express";
import { callLLM } from "../services/llmAdapters";
import { generateMedia } from "../services/mediaGenerators";

const router = Router();

// In-memory connectors store for demo. Replace with DB in production.
const connectors: Record<string, any> = {};

router.get("/", (_req, res) => {
  res.json(Object.values(connectors));
});

router.post("/", (req, res) => {
  const id = `c_${Date.now()}`;
  const cfg = { id, ...req.body };
  // ensure type exists (llm | pdf | image | video)
  cfg.type = cfg.type || "llm";
  connectors[id] = cfg;
  res.status(201).json(cfg);
});

// Unified generate endpoint that dispatches based on connector type
router.post("/:id/generate", async (req, res) => {
  const id = req.params.id;
  const cfg = connectors[id];
  if (!cfg) return res.status(404).json({ error: "connector not found" });

  try {
    if (cfg.type === "llm") {
      const { prompt, options } = req.body;
      const result = await callLLM(cfg, prompt, options);
      return res.json({ type: "llm", data: result });
    }

    if (cfg.type === "image" || cfg.type === "video") {
      const { prompt, options } = req.body;
      const result = await generateMedia(cfg, prompt, options);
      return res.json({ type: cfg.type, data: result });
    }

    if (cfg.type === "pdf") {
      // For pdf connectors, we expect a url or path to PDF to extract
      const { url } = req.body;
      // In demo, we just echo back
      return res.json({ type: "pdf", data: { extractedText: `Simulated extract from ${url}` } });
    }

    return res.status(400).json({ error: "unsupported connector type" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
});

export default router;
