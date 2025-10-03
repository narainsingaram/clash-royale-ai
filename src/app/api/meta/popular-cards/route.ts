import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    console.log('[popular-cards] Attempting to fetch collected meta decks...');
    // Fetch the collected meta decks
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/collect-meta-decks`
    );
    const metaDecks = response.data.metaDecks;

    if (!metaDecks || metaDecks.length === 0) {
      console.warn('[popular-cards] No meta decks available from /api/collect-meta-decks.');
      return NextResponse.json({ error: 'No meta decks available' }, { status: 404 });
    }

    console.log(`[popular-cards] Successfully fetched ${metaDecks.length} meta decks. Counting card occurrences...`);

    // Count card occurrences
    const cardCounts: { [cardId: string]: { name: string; count: number; iconUrls: { medium: string } } } = {};
    metaDecks.forEach((deckData: any) => {
      deckData.deck.forEach((card: any) => {
        if (!cardCounts[card.id]) {
          cardCounts[card.id] = { name: card.name, count: 0, iconUrls: card.iconUrls };
        }
        cardCounts[card.id].count++;
      });
    });

    // Convert to array and sort by count
    const popularCards = Object.values(cardCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 popular cards

    console.log(`[popular-cards] Identified ${popularCards.length} popular cards.`);
    return NextResponse.json({ popularCards });
  } catch (error: any) {
    console.error('[popular-cards] Failed to get popular cards:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to get popular cards' }, { status: 500 });
  }
}