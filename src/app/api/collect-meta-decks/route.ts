
import { NextResponse } from 'next/server';
import axios from 'axios';

// Simple in-memory cache for meta decks
let cachedMetaDecks: any[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 6; // Cache for 6 hours

// Function to introduce a delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET() {
  // Check if cache is still valid
  if (cachedMetaDecks.length > 0 && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    console.log('Serving meta decks from cache.');
    return NextResponse.json({ metaDecks: cachedMetaDecks });
  }

  console.log('Fetching new meta decks...');
  const allDecks: any[] = [];
  const API_KEY = process.env.CLASH_ROYALE_API_TOKEN;

  if (!API_KEY) {
    return NextResponse.json({ error: 'CLASH_ROYALE_API_TOKEN not set' }, { status: 500 });
  }

  const HEADERS = {
    Authorization: `Bearer ${API_KEY}`,
  };

  try {
    // 1. Fetch Top Global Players
    const topPlayersUrl = "https://api.clashroyale.com/v1/locations/global/rankings/players";
    const playersResponse = await axios.get(topPlayersUrl, { headers: HEADERS });
    const players = playersResponse.data.items || [];

    // Limit to a reasonable number of players to avoid excessive API calls
    const playersToFetch = players.slice(0, 50); // Fetch decks for top 50 players

    // 2. Iterate and Fetch Player Profiles to get currentDeck
    for (const player of playersToFetch) {
      const playerTag = player.tag.replace("#", ""); // API expects tag without # in URL path
      const playerUrl = `https://api.clashroyale.com/v1/players/%23${playerTag}`;

      try {
        await delay(100); // Delay to respect API rate limits
        const playerProfileResponse = await axios.get(playerUrl, { headers: HEADERS });
        const playerProfile = playerProfileResponse.data;

        if (playerProfile.currentDeck && playerProfile.currentDeck.length === 8) {
          const deckCards = playerProfile.currentDeck.map((card: any) => ({
            id: card.id.toString(),
            name: card.name,
            elixirCost: card.elixirCost,
            rarity: card.rarity,
            // Add other relevant card data if needed for vectorization later
          }));
          allDecks.push({ playerTag: player.tag, deck: deckCards, trophies: player.trophies });
        }
      } catch (playerError) {
        console.error(`Failed to fetch profile for player ${player.tag}:`, playerError);
        // Continue to next player even if one fails
      }
    }

    // Update cache
    cachedMetaDecks = allDecks;
    lastFetchTime = Date.now();
    console.log(`Fetched ${allDecks.length} new meta decks.`);

    return NextResponse.json({ metaDecks: allDecks });
  } catch (error) {
    console.error('Failed to collect meta decks:', error);
    return NextResponse.json({ error: 'Failed to collect meta decks' }, { status: 500 });
  }
}
