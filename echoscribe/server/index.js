import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch'; // <-- Import node-fetch
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// --- Setup AI Clients ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const stabilityApiKey = process.env.STABILITY_API_KEY;
const stabilityApiHost = 'https://api.stability.ai';

// --- Define the API Endpoint ---
app.post('/api/ai/intervene', async (req, res) => {
  const { storyPremise, recentTurnsText } = req.body;

  if (!storyPremise || !recentTurnsText) {
    return res.status(400).json({ error: 'Premise and recent turns are required.' });
  }

  try {
    // 1. Generate the plot twist with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      Based on the story premise: "${storyPremise}"
      And the last few turns: "${recentTurnsText}"
      Generate a short, surprising plot twist (2-3 sentences). Do not start with "Plot Twist:". Just write the event.
    `;
    const result = await model.generateContent(prompt);
    const plotTwist = result.response.text();

    // 2. Generate an image for the plot twist using the Stability AI REST API
    const response = await fetch(
      `${stabilityApiHost}/v1/generation/stable-diffusion-v1-6/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${stabilityApiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: `Epic, cinematic, detailed digital painting of: ${plotTwist}` }],
          cfg_scale: 7,
          height: 512,
          width: 512,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Stability AI request failed with status ${response.status}`);
    }

    const responseJSON = await response.json();
    // NOTE: Stability AI returns a base64 encoded image. You need a place to store it.
    // For now, we'll just acknowledge we got it. A real app would upload this to Supabase Storage.
    const imageArtifact = responseJSON.artifacts[0];
    
    // 3. Send the response back to the frontend
    res.json({
      aiContent: plotTwist,
      // In a real app, you'd return the URL of the image after uploading it.
      // For now, we are just confirming it worked.
      aiImageUrl: `data:image/png;base64,${imageArtifact.base64}`,
    });

  } catch (error) {
    console.error("AI generation failed:", error);
    res.status(500).json({ error: 'Failed to generate AI content.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));