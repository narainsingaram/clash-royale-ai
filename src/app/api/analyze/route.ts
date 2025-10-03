import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { deck } = await req.json();

    const prompt = `
      You are a highly experienced Clash Royale deck analyst. Your goal is to provide dynamic, insightful, and meta-aware feedback on the user's deck. Consider current popular meta decks, card usage rates, and win rates when formulating your analysis. The response should be a JSON object, structured for easy parsing and dynamic display on a frontend.

      Deck:
      ${deck.map((card: any) => `- ${card.name} (Elixir: ${card.elixirCost}, Rarity: ${card.rarity}, Win Rate: ${card.winRate?.toFixed(2)}%, Usage Rate: ${card.usageRate?.toFixed(2)}%)`).join('\n')}

      Provide a comprehensive analysis as a JSON object with the following structure:
      {
        "deckOverview": {
          "archetype": "string", // e.g., "Beatdown", "Siege", "Cycle", "Control"
          "playstyle": "string",
          "elixirComment": "string", // Comment on average elixir cost in meta context
          "cardRoles": { // Categorization of cards by role
            "winConditions": ["string"], // Names of cards that are primary win conditions
            "supportCards": ["string"], // Names of cards that support win conditions or defense
            "cycleCards": ["string"], // Names of low-elixir cards used for cycling
            "defensiveCore": ["string"], // Names of cards central to defense (e.g., buildings, strong defensive troops)
            "spells": ["string"] // Names of spell cards
          }
        },
        "strengths": [
          { "title": "string", "description": "string" } // 2-3 significant strengths
        ],
        "weaknesses": [
          { "title": "string", "description": "string" } // 2-3 major weaknesses
        ],
        "synergies": [
          { "title": "string", "description": "string" } // 2-3 crucial card synergies
        ],
        "suggestedImprovements": [
          {
            "cardToReplace": "string", // Name of card to replace
            "reasonToReplace": "string",
            "cardToAdd": "string", // Name of card to add
            "reasonToAdd": "string"
          }
        ]
      }

      Ensure your feedback is direct, uses Clash Royale terminology, and is highly valuable for a player looking to optimize their deck for competitive play. The entire response MUST be a valid JSON object.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const analysis = response.data.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Failed to analyze deck:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to analyze deck' }, { status: 500 });
  }
}