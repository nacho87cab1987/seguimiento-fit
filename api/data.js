// Función serverless: guarda y lee los datos de la app en Redis (Upstash) en Vercel.
// Todo se guarda en un único hash ("cf:store"), un campo por cada clave.
import { Redis } from "@upstash/redis";

const redis = new Redis({
  // El Marketplace de Vercel (Upstash) inyecta KV_REST_API_*; Upstash directo usa UPSTASH_REDIS_REST_*
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
  automaticDeserialization: false, // guardamos/leemos strings tal cual
});

const HASH = "cf:store";

export default async function handler(req, res) {
  // Clave de acceso opcional. Si definís APP_PASSWORD en Vercel, se exige en cada pedido.
  const pass = process.env.APP_PASSWORD;
  if (pass && req.headers["x-app-key"] !== pass) {
    return res.status(401).json({ error: "No autorizado" });
  }
  try {
    if (req.method === "GET") {
      const key = req.query.key;
      if (key === "__ping") return res.status(200).json({ ok: true });
      if (!key) return res.status(400).json({ error: "Falta key" });
      const value = await redis.hget(HASH, key);
      return res.status(200).json({ value: value ?? null });
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      if (!body.key) return res.status(400).json({ error: "Falta key" });
      await redis.hset(HASH, { [body.key]: body.value });
      return res.status(200).json({ ok: true });
    }
    if (req.method === "DELETE") {
      const key = req.query.key;
      if (key) await redis.hdel(HASH, key);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Método no permitido" });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
