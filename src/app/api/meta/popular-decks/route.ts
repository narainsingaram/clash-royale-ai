import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    console.log('[popular-decks] Attempting to fetch collected meta decks...');
    // Fetch the collected meta decks
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/collect-meta-decks`
    );
    const metaDecks = response.data.metaDecks;

    if (!metaDecks || metaDecks.length === 0) {
      console.warn('[popular-decks] No meta decks available from /api/collect-meta-decks.');
      return NextResponse.json({ error: 'No meta decks available' }, { status: 404 });
    }

    console.log(`[popular-decks] Successfully fetched ${metaDecks.length} meta decks. Counting deck occurrences...`);

    // Count exact deck occurrences
    const deckCounts: { [deckSignature: string]: { count: number; deck: any[] } } = {};

    metaDecks.forEach((deckData: any) => {
      // Create a canonical signature for each deck (sorted card IDs)
      const deckSignature = deckData.deck.map((card: any) => card.id).sort().join('-');

      if (!deckCounts[deckSignature]) {
        deckCounts[deckSignature] = { count: 0, deck: deckData.deck };
      }
      deckCounts[deckSignature].count++;
    });

    // Convert to array and sort by count
    const popularDecks = Object.values(deckCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 most popular exact decks

    console.log(`[popular-decks] Identified ${popularDecks.length} popular decks.`);
    return NextResponse.json({ popularDecks });
  } catch (error: any) {
    console.error('[popular-decks] Failed to get popular decks:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to get popular decks' }, { status: 500 });
  }
}