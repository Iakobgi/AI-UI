import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import connectorsRouter from "./routes/connectors";
import ragRouter from "./routes/rag";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/connectors", connectorsRouter);
app.use("/api/rag", ragRouter);

// Serve static media (generated images/videos)
app.use("/media", express.static(path.join(__dirname, "../public/media")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
