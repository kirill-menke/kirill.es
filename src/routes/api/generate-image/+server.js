import { json } from '@sveltejs/kit';
import { GoogleGenAI, Modality } from '@google/genai';

const GEMINI_API_KEY = 'AIzaSyBsNaydZySQ8kU0ZS5mnRerOKpsGsSJTZ0';

export async function POST({ request }) {
  try {
    const { prompt, neighbors } = await request.json();

    if (!prompt) {
      return json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Build the contents array for multi-modal generation
    const contents = [];

    // Add neighboring images with spatial context if they exist
    if (neighbors && Object.keys(neighbors).length > 0) {
      // Build spatial context description
      let instructionPrompt = 'Generate a new pixel art landscape tile that seamlessly connects with the existing tiles. The new tile MUST:\n';

      instructionPrompt += `1. Contain the following content: ${prompt}\n`;
      instructionPrompt += '2. Have a similar pixel art style, and exactly the same perspective as the provided neighboring tiles\n';
      instructionPrompt += '2. Have seamless coherent borders where it connects to existing tiles (no visible seams or abrupt transitions)\n';
      instructionPrompt += '3. Continue the landscape elements naturally (terrain, paths, water, etc. should flow continuously)\n';
      instructionPrompt += '4. Maintains coherent lighting and shading consistent with neighboring tiles\n';
      instructionPrompt += '5. Retain a top-down/isometric view matching the perspective of adjacent tiles\n';
      instructionPrompt += '6. Also uses the retro 8-bit pixel art aesthetic\n\n';
      instructionPrompt += 'Most importantly, the generated tile should blend perfectly with its neighbors to create one cohesive landscape.';
      instructionPrompt += 'Here are the existing neighboring tiles with their position relative to the new tile to be generated:';

      contents.push({
        text: instructionPrompt
      });

      // Add each neighboring image with its position
      for (const [position, imageUrl] of Object.entries(neighbors)) {
        if (imageUrl && imageUrl.startsWith('data:')) {
          // Extract base64 data from data URL
          const base64Match = imageUrl.match(/^data:([^;]+);base64,(.*)$/);
          if (base64Match) {
            const mimeType = base64Match[1];
            const base64Data = base64Match[2];

            contents.push({
              text: `- Image on ${position} relative to the new image to be generated:`
            });

            contents.push({
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            });
          }
        }
      } 
    } else {
      // No neighbors - this is likely the first tile or an isolated tile
      const enhancedPrompt = `Create a pixel art landscape tile with the following content: ${prompt}. 
        Style: retro 8-bit pixel art, vibrant colors, top-down/isometric view, clean pixelated aesthetic. 
        This tile should be designed to potentially connect seamlessly with future neighboring tiles.`;

      contents.push({
        text: enhancedPrompt
      });
    }

    console.log(contents);

    // Generate image with Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Extract the generated image
    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          // Convert base64 image data to data URL
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mimeType};base64,${imageData}`;

          return json({
            imageUrl,
            message: 'Image generated successfully'
          });
        }
      }
    }

    // If no image was generated, return error
    return json({
      error: 'No image was generated. Try a different prompt.'
    }, { status: 500 });

  } catch (error) {
    console.error('Error generating image:', error);

    // Check if it's an API key issue
    if (error.message && error.message.includes('API key')) {
      return json({
        error: 'API key issue. Please check the Gemini API key configuration.'
      }, { status: 500 });
    }

    return json({
      error: 'Failed to generate image. Please try again.'
    }, { status: 500 });
  }
}