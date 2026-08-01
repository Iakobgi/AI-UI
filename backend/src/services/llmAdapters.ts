import axios from "axios";

export type LLMProviderConfig = {
  id: string;
  name: string;
  kind?: string;
  baseUrl?: string;
  apiKey?: string;
  requestTemplate?: (prompt: string, options?: any) => { url: string; method?: string; body?: any; headers?: any };
};

export async function callLLM(provider: LLMProviderConfig, prompt: string, options: any = {}) {
  if (provider.requestTemplate) {
    const req = provider.requestTemplate(prompt, options);
    const resp = await axios({
      url: req.url,
      method: req.method || "POST",
      headers: req.headers,
      data: req.body,
    });
    return resp.data;
  }

  const url = provider.baseUrl ? `${provider.baseUrl}/v1/chat/completions` : "https://api.openai.com/v1/chat/completions";
  const body = {
    model: options.model || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: options.max_tokens || 600,
  };
  const headers: any = { "Content-Type": "application/json" };
  if (provider.apiKey) headers["Authorization"] = `Bearer ${provider.apiKey}`;

  const resp = await axios.post(url, body, { headers });
  return resp.data;
}
