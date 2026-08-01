/**
 * Demo media generator service.
 * - For real image/video generation wire this to Replicate/Stability/Runway/etc.
 * - This demo will create a placeholder file in backend/public/media and return its URL.
 */

import fs from "fs";
import path from "path";

export async function generateMedia(cfg: any, prompt: string, options: any = {}) {
  const type = cfg.type || "image"; // image | video
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2,8)}.${type === "image" ? "png" : "mp4"}`;
  const mediaDir = path.join(__dirname, "../public/media");
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  const filepath = path.join(mediaDir, filename);

  // Create a tiny placeholder file to simulate media (not a real image/video).
  // Replace with actual calls to providers and save real content.
  fs.writeFileSync(filepath, `SIMULATED_${type.toUpperCase()}_FOR_PROMPT:${prompt}`);

  const url = `/media/${filename}`;
  return { url, localPath: filepath };
}
