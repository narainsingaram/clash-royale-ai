
import { NextResponse } from 'next/server';

const WIN_CONDITIONS = ['Hog Rider', 'Golem', 'Royal Giant', 'Goblin Giant', 'Ram Rider', 'Lava Hound', 'Balloon', 'X-Bow', 'Mortar', 'Graveyard', 'Goblin Barrel', 'Miner', 'Three Musketeers', 'Elixir Golem', 'Battle Ram', 'Wall Breakers', 'Royal Hogs'];
const BIG_SPELLS = ['Fireball', 'Poison', 'Lightning', 'Rocket', 'Freeze'];
const SMALL_SPELLS = ['The Log', 'Zap', 'Snowball', 'Arrows', 'Tornado'];

interface Card {
  name: string;
  elixir: number;
}

export async function POST(request: Request) {
  const { deck } = await request.json();

  if (!deck || deck.length !== 8) {
    return NextResponse.json({ error: 'Invalid deck' }, { status: 400 });
  }

  let analysis = '';

  // Average Elixir Cost
  const totalElixir = deck.reduce((sum: number, card: Card) => sum + card.elixir, 0);
  const avgElixir = totalElixir / 8;
  analysis += `Average Elixir Cost: ${avgElixir.toFixed(2)}. `;
  if (avgElixir < 3.5) {
    analysis += 'This is a fast cycle deck. ';
  } else if (avgElixir > 4.5) {
    analysis += 'This is a heavy beatdown deck. ';
  } else {
    analysis += 'This deck has a balanced elixir cost. ';
  }

  // Win Condition
  const winConditionsInDeck = deck.filter((card: Card) => WIN_CONDITIONS.includes(card.name));
  if (winConditionsInDeck.length === 0) {
    analysis += 'Warning: This deck lacks a clear win condition. ';
  } else {
    analysis += `Win condition(s): ${winConditionsInDeck.map(c => c.name).join(', ')}. `;
  }

  // Spells
  const bigSpellsInDeck = deck.filter((card: Card) => BIG_SPELLS.includes(card.name));
  const smallSpellsInDeck = deck.filter((card: Card) => SMALL_SPELLS.includes(card.name));

  if (bigSpellsInDeck.length === 0) {
    analysis += 'Consider adding a big spell for more control. ';
  }
  if (smallSpellsInDeck.length === 0) {
    analysis += 'Consider adding a small spell for versatile defense. ';
  }

  return NextResponse.json({ analysis });
}
