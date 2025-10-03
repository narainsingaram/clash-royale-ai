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
    console.log('[collect-meta-decks] Serving meta decks from cache.');
    return NextResponse.json({ metaDecks: cachedMetaDecks });
  }

  console.log('[collect-meta-decks] Fetching new meta decks...');
  const allDecks: any[] = [];
  const API_KEY = process.env.CLASH_ROYALE_API_TOKEN;

  if (!API_KEY) {
    console.error('[collect-meta-decks] CLASH_ROYALE_API_TOKEN not set');
    return NextResponse.json({ error: 'CLASH_ROYALE_API_TOKEN not set' }, { status: 500 });
  }

  const HEADERS = {
    Authorization: `Bearer ${API_KEY}`,
  };

  try {
    // 1. Fetch Top Global Players
    const topPlayersUrl = "https://api.clashroyale.com/v1/locations/global/rankings/players";
    console.log(`[collect-meta-decks] Fetching top players from: ${topPlayersUrl}`);
    const playersResponse = await axios.get(topPlayersUrl, { headers: HEADERS });
    const players = playersResponse.data.items || [];
    console.log(`[collect-meta-decks] Fetched ${players.length} top players.`);

    // Reduce the number of players fetched to be less aggressive with API limits
    const playersToFetch = players.slice(0, 20); // Reduced from 100 to 20

    // 2. Iterate and Fetch Player Profiles to get currentDeck
    for (const player of playersToFetch) {
      const playerTag = player.tag.replace("#", ""); // API expects tag without # in URL path
      const playerUrl = `https://api.clashroyale.com/v1/players/%23${playerTag}`;

      try {
        await delay(200); // Increased delay to 200ms
        const playerProfileResponse = await axios.get(playerUrl, { headers: HEADERS });
        const playerProfile = playerProfileResponse.data;

        if (playerProfile.currentDeck && playerProfile.currentDeck.length === 8) {
          // Ensure card.iconUrls.medium is present
          const deckCards = playerProfile.currentDeck.map((card: any) => ({
            id: card.id.toString(),
            name: card.name,
            iconUrls: { medium: card.iconUrls.medium || '' }, // Ensure iconUrls.medium is always a string
            elixirCost: card.elixirCost,
            rarity: card.rarity,
          }));
          allDecks.push({
            playerTag: player.tag,
            playerName: player.name,
            trophies: player.trophies,
            location: 'Global',
            deck: deckCards,
            collectedAt: Date.now(),
          });
        } else {
          console.warn(`[collect-meta-decks] Player ${player.tag} has no 8-card currentDeck or incomplete data.`);
        }
      } catch (playerError: any) {
        console.error(`[collect-meta-decks] Failed to fetch profile for player ${player.tag}:`, playerError.response?.data || playerError.message);
        // Continue to next player even if one fails
      }
    }

    // Update cache
    cachedMetaDecks = allDecks;
    lastFetchTime = Date.now();
    console.log(`[collect-meta-decks] Successfully fetched and cached ${allDecks.length} new meta decks.`);

    return NextResponse.json({ metaDecks: allDecks });
  } catch (error: any) {
    console.error('[collect-meta-decks] Failed to collect meta decks overall:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to collect meta decks' }, { status: error.response?.status || 500 });
  }
}