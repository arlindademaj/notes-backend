import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "Note content is required",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `You are an assistant that summarizes my notes in JSON. 
       Output must have:
      - "summary": a short paragraph (1-2 sentences)
      - "key_points": an array of 3 concise bullet points

      Do NOT include anything else, do NOT write explanations.
        Note: ${content}
      `,
    });

    const aiOutput = response.output_text;
    const parsed = JSON.parse(aiOutput);

    res.status(200).json(parsed);
  } catch (error) {
    res.status(500).json({ error: "Ai failed" });
  }
};
