import React from 'react';
import Tilt from 'react-parallax-tilt';

// Types
interface Card {
  id: string;
  name: string;
  iconUrls: {
    medium: string;
  };
  rarity: string;
  elixirCost: number;
}

interface DeckProps {
  deck: Card[];
  swappingCardId: string | null;
  swappedInCard: Card | null;
  handleDeckCardClick: (card: Card) => void;
  calculateAverageElixir: () => string;
  highlightedCards: string[];
}

export default function Deck({
  deck,
  swappingCardId,
  swappedInCard,
  handleDeckCardClick,
  calculateAverageElixir,
  highlightedCards,
}: DeckProps) {
  return (
    <div className="clash-panel overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b-2 border-clash-wood flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-clash-gold">Your Deck</h2>
          <p className="text-sm text-clash-wood mt-0.5">{deck.length} of 8 cards</p>
        </div>
        
        {/* Average Elixir */}
        <div className="flex items-center gap-2 px-4 py-2 bg-clash-wood bg-opacity-20 rounded-lg border border-clash-wood">
          <span className="text-lg">⚡</span>
          <div>
            <p className="text-xs text-clash-wood uppercase tracking-wide font-medium">Avg Elixir</p>
            <p className="text-xl font-semibold text-clash-gold">{calculateAverageElixir()}</p>
          </div>
        </div>
      </div>

      {/* Deck Grid */}
      <div className="p-6">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {deck.map(card => (
            <div
              key={card.id}
              onClick={() => handleDeckCardClick(card)}
              className={`group cursor-pointer relative transition-all duration-200 ${
                swappingCardId === card.id ? 'opacity-40 scale-95' : 'hover:scale-105'
              } ${highlightedCards.includes(card.name) ? 'highlighted-card' : ''}`}            >
              <div className="relative">
                <Tilt 
                  glareEnable={false}
                  tiltMaxAngleX={8} 
                  tiltMaxAngleY={8}
                  scale={1.02}
                >
                  <div className="relative rounded-lg overflow-hidden shadow-md border-2 border-clash-wood bg-gradient-to-br from-amber-50 to-yellow-100 transition-all duration-200 group-hover:shadow-lg group-hover:border-clash-gold">
                    <img 
                      src={card.iconUrls.medium} 
                      alt={card.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Tilt>
                
                {/* Hover indicator */}
                <div className="absolute top-1 right-1 w-5 h-5 bg-clash-wood rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-xs">↔</span>
                </div>
              </div>
              
              <p className="text-xs font-medium text-clash-wood mt-2 text-center leading-tight line-clamp-2">
                {card.name}
              </p>
            </div>
          ))}

          {/* Swapping In Card */}
          {swappingCardId && swappedInCard && (
            <div 
              key={swappedInCard.id} 
              className="cursor-pointer relative animate-[fadeIn_0.3s_ease-out]"
            >
              <div className="relative">
                <Tilt 
                  glareEnable={false}
                  tiltMaxAngleX={8} 
                  tiltMaxAngleY={8}
                >
                  <div className="relative rounded-lg overflow-hidden shadow-md border-2 border-clash-wood bg-gradient-to-br from-amber-50 to-yellow-100">
                    <img 
                      src={swappedInCard.iconUrls.medium} 
                      alt={swappedInCard.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Tilt>
              </div>
              <p className="text-xs font-medium text-clash-wood mt-2 text-center leading-tight line-clamp-2">
                {swappedInCard.name}
              </p>
            </div>
          )}

          {/* Empty Slots */}
          {[...Array(8 - deck.length)].map((_, i) => (
            <div 
              key={`empty-${i}`} 
              className="aspect-square rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-dashed border-clash-wood flex items-center justify-center transition-colors duration-200 hover:bg-amber-50 hover:border-clash-gold"
            >
              <svg className="w-6 h-6 text-clash-wood" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          ))}

        </div>

        {/* Helper Text */}
        {deck.length < 8 && (
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-clash-wood">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Add {8 - deck.length} more {deck.length === 7 ? 'card' : 'cards'} to complete your deck</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}