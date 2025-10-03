import React, { useState } from 'react';
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

interface CardListProps {
  filteredCards: Card[];
  addingCard: Card | null;
  handleCardClick: (card: Card) => void;
  openCardModal: (card: Card) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function CardList({
  filteredCards,
  addingCard,
  handleCardClick,
  openCardModal,
  searchQuery,
  setSearchQuery,
}: CardListProps) {
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const rarities = ['all', 'common', 'rare', 'epic', 'legendary', 'champion'];

  // Apply rarity filter
  const cardsToDisplay = filterRarity === 'all' 
    ? filteredCards 
    : filteredCards.filter(card => card.rarity.toLowerCase() === filterRarity);

  // Apply sorting
  const sortedCards = [...cardsToDisplay].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'elixir') return a.elixirCost - b.elixirCost;
    if (sortBy === 'rarity') {
      const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3, champion: 4 };
      return (rarityOrder[a.rarity.toLowerCase() as keyof typeof rarityOrder] || 0) - 
             (rarityOrder[b.rarity.toLowerCase() as keyof typeof rarityOrder] || 0);
    }
    return 0;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Available Cards</h2>
              <p className="text-sm text-gray-500 mt-0.5">{sortedCards.length} cards available</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search cards by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex flex-wrap gap-2">
            {rarities.map(rarity => (
              <button
                key={rarity}
                onClick={() => setFilterRarity(rarity)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterRarity === rarity
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="name">Name</option>
              <option value="elixir">Elixir Cost</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="p-6">
        {sortedCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No cards found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
            {sortedCards.map(card => (
              <div
                key={card.id}
                className={`group relative cursor-pointer transition-all duration-200 ${
                  addingCard?.id === card.id ? 'animate-pulse opacity-50' : 'hover:scale-105'
                }`}
                onClick={() => handleCardClick(card)}
              >
                <div className="relative">
                  <Tilt 
                    glareEnable={false}
                    tiltMaxAngleX={8} 
                    tiltMaxAngleY={8}
                    scale={1.02}
                  >
                    <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white transition-all duration-200 group-hover:shadow-lg group-hover:border-gray-300">
                      <img 
                        src={card.iconUrls.medium} 
                        alt={card.name} 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Elixir cost badge */}
                      <div className="absolute top-1 left-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white">
                        {card.elixirCost}
                      </div>
                    </div>
                  </Tilt>
                  
                  {/* Info button */}
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      openCardModal(card); 
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-gray-900/80 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  {/* Add indicator */}
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg border-2 border-white">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>
                
                <p className="text-xs font-medium text-gray-700 mt-1.5 text-center leading-tight line-clamp-2 px-0.5">
                  {card.name}
                </p>

                {/* Rarity indicator */}
                <div className={`mt-1 h-1 rounded-full mx-auto ${
                  card.rarity.toLowerCase() === 'legendary' ? 'w-full bg-yellow-400' :
                  card.rarity.toLowerCase() === 'champion' ? 'w-full bg-amber-500' :
                  card.rarity.toLowerCase() === 'epic' ? 'w-full bg-purple-400' :
                  card.rarity.toLowerCase() === 'rare' ? 'w-full bg-orange-400' :
                  'w-3/4 bg-gray-300'
                }`}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}