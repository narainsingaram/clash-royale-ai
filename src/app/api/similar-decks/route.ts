
import { NextResponse } from 'next/server';
import axios from 'axios';

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  if (magnitudeA === 0 || magnitudeB === 0) return 0; // Avoid division by zero
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function POST(req: Request) {
  try {
    const { userDeck } = await req.json();

    // 1. Fetch all available cards to create a comprehensive card vocabulary
    const cardsResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cards`
    );
    const allAvailableCards = cardsResponse.data.items;

    // Create a mapping from card ID to its index in the vector
    const cardIdToIndex: { [key: string]: number } = {};
    allAvailableCards.forEach((card: any, index: number) => {
      cardIdToIndex[card.id] = index;
    });

    // Function to convert a deck (list of card objects) into a one-hot vector
    const vectorizeDeck = (deck: any[]): number[] => {
      const vector = new Array(allAvailableCards.length).fill(0);
      deck.forEach(card => {
        const index = cardIdToIndex[card.id];
        if (index !== undefined) {
          vector[index] = 1;
        }
      });
      return vector;
    };

    // Vectorize the user's deck
    const userDeckVector = vectorizeDeck(userDeck);

    // 2. Fetch dynamically collected meta decks
    const metaDecksResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/collect-meta-decks`
    );
    const collectedMetaDecks = metaDecksResponse.data.metaDecks;

    // 3. Calculate similarity with each collected meta deck
    const similarities = collectedMetaDecks.map((metaDeckData: any) => {
      const metaDeckVector = vectorizeDeck(metaDeckData.deck);
      const similarity = cosineSimilarity(userDeckVector, metaDeckVector);
      return { ...metaDeckData, similarity };
    });

    // 4. Sort by similarity and get top N
    const topSimilarDecks = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3); // Get top 3 similar decks

    // 5. Prepare prompt for AI commentary
    const prompt = `
      You are a Clash Royale expert deck analyst. A user has provided their deck, and we have algorithmically identified several real, top-performing meta decks that are most similar. Your task is to provide insightful commentary on the user's deck in comparison to these similar meta decks.

      User's Deck:
      ${userDeck.map((card: any) => `- ${card.name} (Elixir: ${card.elixirCost}, Rarity: ${card.rarity})`).join('\n')}

      Top Algorithmically Similar Meta Decks (with similarity score and full card details):
      ${topSimilarDecks.map((metaDeck: any) => `
        - Name: Meta Deck from Player ${metaDeck.playerTag} (Trophies: ${metaDeck.trophies})
          Similarity Score: ${metaDeck.similarity.toFixed(2)}
          Cards: ${metaDeck.deck.map((card: any) => `${card.name} (ID: ${card.id}, Elixir: ${card.elixirCost}, Rarity: ${card.rarity})`).join(', ')}
      `).join('\n')}

      Based on this information, provide a JSON object with the following structure:
      {
        "identifiedArchetype": "string", // Infer the most likely archetype of the user's deck based on the similar meta decks
        "similarMetaDecks": [
          {
            "name": "string", // Name of the similar meta deck (e.g., "2.6 Hog Cycle" or a description like "Top Ladder Beatdown")
            "coreStrategy": "string", // Brief explanation of this meta deck's core strategy
            "similarityExplanation": "string", // Explanation of why it's similar to the user's deck, referencing the similarity score and card overlap
            "keyDifferences": "string", // Key differences from the user's deck
            "suggestedSwapsToMatch": [
              { "cardToReplace": "string", "cardToAdd": "string", "reason": "string" }
            ],
            "cards": [ // Full card objects for this meta deck
              { "id": "string", "name": "string", "iconUrls": { "medium": "string" }, "elixirCost": number, "maxLevel": number, "rarity": "string" }
            ]
          }
        ] // 1-3 most similar meta decks, ordered by similarity
      }

      Ensure your feedback is direct, uses Clash Royale terminology, and is highly valuable for a player looking to optimize their deck for competitive play. The entire response MUST be a valid JSON object. Do NOT include any other text or markdown outside the JSON.
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

    const similarDecksData = response.data.choices[0].message.content;

    return NextResponse.json({ similarDecksData });
  } catch (error) {
    console.error('Failed to find similar decks:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to find similar decks' }, { status: 500 });
  }
}
