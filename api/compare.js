// Función serverless de Vercel: recibe el pedido de comparación de fotos del navegador,
// le agrega tu clave de Anthropic (guardada como variable de entorno, nunca en el navegador)
// y reenvía la respuesta. Así la clave queda secreta.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: "Falta la variable ANTHROPIC_API_KEY en Vercel (Settings → Environment Variables).",
    });
  }
  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body,
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
