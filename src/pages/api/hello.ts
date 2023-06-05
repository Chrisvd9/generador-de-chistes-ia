import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    if (!prompt || prompt.length === 0) {
      return res.status(400).json({ error: "El prompt es requerido" });
    }

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Dame un chiste corto basado en este tema: ${prompt}`,
        temperature: 0.8,
        max_tokens: 100,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const text = response.data.choices[0].text;
      return res.status(200).json({ responseText: text });
    } catch (error) {
      return res.status(500).json({ error: "Error al generar la respuesta" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
