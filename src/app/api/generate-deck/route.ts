
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { archetype, elixirPreference, winConditionPreference, availableCards } = await req.json();

    const prompt = `
      You are a Clash Royale expert deck builder. Your task is to create a highly optimized 8-card deck based on the user's preferences and the provided list of available cards. The deck should be cohesive, meta-relevant, and have strong synergies.

      User Preferences:
      - Archetype: ${archetype || 'Any'}
      - Elixir Cost Preference: ${elixirPreference || 'Balanced'}
      - Win Condition Preference: ${winConditionPreference || 'Any'}

      Available Cards (Name, Elixir, Rarity, Win Rate, Usage Rate):
      ${availableCards.map((card: any) => `- ${card.name} (Elixir: ${card.elixirCost}, Rarity: ${card.rarity}, Win Rate: ${card.winRate?.toFixed(2)}%, Usage Rate: ${card.usageRate?.toFixed(2)}%)`).join('\n')}

      Select exactly 8 cards from the Available Cards list to form a new deck. Consider the current meta, card synergies, and counter-play. Provide the generated deck as a JSON object with the following structure:
      {
        "generatedDeck": [
          { "id": "string", "name": "string" }, // 8 card objects with id and name
          // ...
        ],
        "explanation": "string" // A brief explanation of why this deck was generated based on preferences and meta.
      }

      Ensure the generated deck is strong and adheres to the user's preferences as much as possible. The entire response MUST be a valid JSON object.
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

    const generatedData = response.data.choices[0].message.content;

    return NextResponse.json({ generatedData });
  } catch (error) {
    console.error('Failed to generate deck:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to generate deck' }, { status: 500 });
  }
}
