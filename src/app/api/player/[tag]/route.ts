import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  const playerTag = params.tag;

  if (!playerTag) {
    return NextResponse.json(
      { error: 'Player tag is required' },
      { status: 400 }
    );
  }

  // Ensure the player tag starts with # and remove it for the API call
  const formattedPlayerTag = playerTag.startsWith('#') ? playerTag.substring(1) : playerTag;

  try {
    const response = await axios.get(
      `https://api.clashroyale.com/v1/players/%23${formattedPlayerTag}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLASH_ROYALE_API_TOKEN}`,
        },
      }
    );

    // Assuming the API returns a 'currentDeck' property directly on the player object
    const playerDeckData = response.data.currentDeck;

    if (!playerDeckData || playerDeckData.length === 0) {
      return NextResponse.json(
        { error: 'No current deck found for this player' },
        { status: 404 }
      );
    }

    const playerDeck = playerDeckData.map((card: any) => ({
      id: card.id.toString(),
      name: card.name,
      iconUrls: { medium: card.iconUrls.medium },
      elixirCost: card.elixirCost,
      maxLevel: card.maxLevel,
      rarity: card.rarity,
    }));

    return NextResponse.json({ decks: [playerDeck] });
  } catch (error: any) {
    console.error('Failed to fetch player data:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.reason || 'Failed to fetch player data' },
      { status: error.response?.status || 500 }
    );
  }
}