
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { deck } = await req.json();

    const prompt = `
      You are a Clash Royale expert. Analyze the following deck and provide feedback.

      Deck:
      ${deck.map((card: any) => `- ${card.name}`).join('\n')}

      Provide the following analysis in markdown format:
      1.  **Strengths:** What are the main strengths of this deck?
      2.  **Weaknesses:** What are the main weaknesses of this deck?
      3.  **Synergies:** What are the key synergies between the cards in this deck?
      4.  **Suggested Improvements:** Suggest 1-2 card replacements to improve the deck and explain why.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const analysis = response.data.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to analyze deck' }, { status: 500 });
  }
}
