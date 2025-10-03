import { NextResponse } from 'next/server';
import axios from 'axios';

// Simple in-memory cache for archetype distribution
let cachedArchetypeDistribution: any = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 12; // Cache for 12 hours

export async function GET() {
  // Check if cache is still valid
  if (cachedArchetypeDistribution && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    console.log('[archetype-distribution] Serving archetype distribution from cache.');
    return NextResponse.json({ archetypeDistribution: cachedArchetypeDistribution });
  }

  console.log('[archetype-distribution] Calculating new archetype distribution...');
  const API_KEY = process.env.OPENROUTER_API_KEY;

  if (!API_KEY) {
    console.error('[archetype-distribution] OPENROUTER_API_KEY not set');
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  try {
    // Fetch the collected meta decks
    console.log('[archetype-distribution] Attempting to fetch collected meta decks...');
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/collect-meta-decks`
    );
    const metaDecks = response.data.metaDecks;

    if (!metaDecks || metaDecks.length === 0) {
      console.warn('[archetype-distribution] No meta decks available from /api/collect-meta-decks.');
      return NextResponse.json({ error: 'No meta decks available for archetype analysis' }, { status: 404 });
    }

    console.log(`[archetype-distribution] Successfully fetched ${metaDecks.length} meta decks. Identifying archetypes...`);

    const archetypeCounts: { [key: string]: number } = {};
    const commonArchetypeNames = [
      "Beatdown", "Siege", "Cycle", "Control", "Bridge Spam", "Spell Bait", "Hog Cycle", "LavaLoon", "Golem Beatdown", "X-Bow Cycle", "Log Bait", "Miner Poison"
    ];

    // Iterate through each meta deck and ask AI to identify its archetype
    for (const deckData of metaDecks) {
      const deckCards = deckData.deck;
      const prompt = `
        You are a Clash Royale expert. Identify the most likely archetype of the following deck from the list: ${commonArchetypeNames.join(', ')}. If none fit perfectly, choose the closest one or suggest a new one if it's truly unique.\n\n        Deck:\n        ${deckCards.map((card: any) => `- ${card.name} (Elixir: ${card.elixirCost}, Rarity: ${card.rarity})`).join('\n')}\n\n        Provide only the archetype name as a plain string. Do NOT include any other text or markdown.\n      `;

      try {
        // Add a delay to avoid hitting OpenRouter rate limits, especially with many decks
        await delay(200); 
        const aiResponse = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
            messages: [{ role: 'user', content: prompt }],
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        let identifiedArchetype = aiResponse.data.choices[0].message.content.trim();
        // Clean up potential quotes or extra text from AI response
        identifiedArchetype = identifiedArchetype.replace(/^"|"$/g, '').trim();

        archetypeCounts[identifiedArchetype] = (archetypeCounts[identifiedArchetype] || 0) + 1;
        console.log(`[archetype-distribution] Identified archetype for deck from player ${deckData.playerTag}: ${identifiedArchetype}`);

      } catch (aiError: any) {
        console.error(`[archetype-distribution] Failed to identify archetype for deck from player ${deckData.playerTag}:`, aiError.response?.data || aiError.message);
        // If AI fails, categorize as 'Unknown'
        archetypeCounts['Unknown'] = (archetypeCounts['Unknown'] || 0) + 1;
      }
    }

    // Calculate percentages
    const totalDecks = metaDecks.length;
    const archetypeDistribution = Object.entries(archetypeCounts).map(([archetype, count]) => ({
      archetype,
      count,
      percentage: (count / totalDecks) * 100,
    }));

    // Update cache
    cachedArchetypeDistribution = archetypeDistribution;
    lastFetchTime = Date.now();
    console.log('[archetype-distribution] Calculated new archetype distribution.');

    return NextResponse.json({ archetypeDistribution });
  } catch (error: any) {
    console.error('[archetype-distribution] Failed to get archetype distribution overall:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to get archetype distribution' }, { status: error.response?.status || 500 });
  }
}