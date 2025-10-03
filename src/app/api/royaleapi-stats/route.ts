
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // RoyaleAPI often provides data through various endpoints or static JSON files.
    // A common approach is to look for a /cards endpoint that might include stats,
    // or a separate /cardstats endpoint.
    // For this example, we'll assume an endpoint that provides card stats.
    // You might need to adjust the URL based on actual RoyaleAPI documentation.
    const response = await axios.get('https://api.royaleapi.com/v1/cards', {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_ROYALE_API_TOKEN}`,
      },
    });

    // The structure of the response will depend on the actual RoyaleAPI endpoint.
    // We'll assume it returns an array of cards, each with winRate and usageRate.
    const cardStats = response.data.items.map((card: any) => ({
      id: card.id.toString(),
      winRate: card.winRate || 0, // Default to 0 if not present
      usageRate: card.usageRate || 0, // Default to 0 if not present
    }));

    return NextResponse.json({ cardStats });
  } catch (error) {
    console.error('Failed to fetch RoyaleAPI card stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RoyaleAPI card stats' },
      { status: 500 }
    );
  }
}
