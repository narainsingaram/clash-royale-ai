import React from 'react';
import { Card } from '../types';

interface FloatingDeckProps {
  deck: Card[];
  calculateAverageElixir: () => string;
}

export default function FloatingDeck({ deck, calculateAverageElixir }: FloatingDeckProps) {
  const topRow = deck.slice(0, 4);
  const bottomRow = deck.slice(4, 8);

  return (
    <div className="fixed bottom-4 right-4 bg-white  bg-opacity-80 p-3 rounded-xl shadow-2xl z-50 animate-fade-in backdrop-blur-sm border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-clash text-white">Your Deck</h3>
        <div className="text-white font-clash text-xl flex items-center">
          <img src="/elixir.png" alt="Elixir" className="w-6 h-6 mr-1" />
          {calculateAverageElixir()}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {topRow.map(card => (
          <div key={card.id} className="w-16">
            <img src={card.iconUrls.medium} alt={card.name} className={`w-full clash-card clash-card-${card.rarity.toLowerCase()}`} />
          </div>
        ))}
        {[...Array(4 - topRow.length)].map((_, i) => (
          <div key={i} className="w-16 h-24 bg-black bg-opacity-20 rounded-lg border-2 border-dashed border-clash-wood" />
        ))}
        {bottomRow.map(card => (
          <div key={card.id} className="w-16">
            <img src={card.iconUrls.medium} alt={card.name} className={`w-full clash-card clash-card-${card.rarity.toLowerCase()}`} />
          </div>
        ))}
        {[...Array(4 - bottomRow.length)].map((_, i) => (
          <div key={i} className="w-16 h-24 bg-black bg-opacity-20 rounded-lg border-2 border-dashed border-clash-wood" />
        ))}
      </div>
    </div>
  );
}
