
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api.clashroyale.com/v1/cards', {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_ROYALE_API_TOKEN}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}
