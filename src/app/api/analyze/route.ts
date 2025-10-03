import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { deck } = await req.json();

    const prompt = `
      You are a highly experienced Clash Royale deck analyst. Your goal is to provide dynamic, insightful, and meta-aware feedback on the user's deck. Consider current popular meta decks, card usage rates, and win rates when formulating your analysis. The response should be structured, easy to read, and provide actionable advice.

      Deck:
      ${deck.map((card: any) => `- ${card.name} (Elixir: ${card.elixirCost}, Rarity: ${card.rarity})`).join('\n')}

      Provide a comprehensive analysis in markdown format, including:

      ### 📊 Deck Overview
      - Briefly describe the likely archetype (e.g., Beatdown, Siege, Cycle, Control) and its general playstyle.
      - Comment on the average elixir cost in the current meta context.

      ### 💪 Strengths
      - Detail 2-3 significant strengths of this deck, explaining *why* they are strengths in the current meta.
      - Mention specific card interactions that create powerful pushes or defenses.

      ### 📉 Weaknesses
      - Identify 2-3 major weaknesses, explaining what common meta decks or card combinations this deck struggles against.
      - Point out any glaring vulnerabilities (e.g., lack of air defense, susceptibility to spell bait).

      ### ✨ Key Synergies
      - Highlight 2-3 crucial card synergies within the deck and how they should be played together.

      ### 💡 Suggested Improvements
      - Propose 1-2 specific card replacements or additions. For each suggestion, explain:
        - Which card to replace and why.
        - Which card to add and why it improves the deck's meta standing, addresses a weakness, or enhances a strength.
        - Consider the impact on elixir cost and overall archetype.

      Ensure your feedback is direct, uses Clash Royale terminology, and is highly valuable for a player looking to optimize their deck for competitive play.
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
