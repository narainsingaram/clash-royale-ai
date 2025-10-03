import React from 'react';
import { PopularCard, PopularDeck, ArchetypeDistributionItem, Card } from '../types';

interface MetaInsightsProps {
  fetchingMetaInsights: boolean;
  popularCards: PopularCard[];
  popularDecks: PopularDeck[];
  archetypeDistribution: ArchetypeDistributionItem[];
}

export default function MetaInsights({
  fetchingMetaInsights,
  popularCards,
  popularDecks,
  archetypeDistribution,
}: MetaInsightsProps) {
  return (
    <div className="clash-panel mb-8">
      <h2 className="text-3xl mb-4 flex items-center"><div className="w-8 h-8 mr-2 bg-clash-gold text-white flex items-center justify-center font-bold rounded-md">M</div> Current Meta Insights</h2>
      {fetchingMetaInsights ? (
        <p className="text-gray-600">Fetching latest meta insights...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Popular Cards */}
          <div>
            <h3 className="text-2xl mb-2">🔥 Top 10 Popular Cards</h3>
            <div className="flex flex-wrap gap-2">
              {popularCards.map(card => (
                <div key={card.name} className="text-center w-16">
                  <img src={card.iconUrls.medium} alt={card.name} className={`w-full clash-card clash-card-common`} />
                  <p className="text-xs">{card.name}</p>
                  <p className="text-xs font-bold">{card.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Decks */}
          <div>
            <h3 className="text-2xl mb-2">🏆 Top 5 Popular Decks</h3>
            {popularDecks.map((deckData, index) => (
              <div key={index} className="mb-4 p-2 border-2 border-clash-wood rounded-lg bg-white bg-opacity-60">
                <p className="font-semibold">Deck {index + 1} ({deckData.count} players)</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {deckData.deck.map(card => (
                    <div key={card.id} className="text-center w-12">
                      <img src={card.iconUrls.medium} alt={card.name} className={`w-full clash-card clash-card-${(card as any).rarity.toLowerCase()}`} />
                      <p className="text-xs">{card.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Archetype Distribution */}
          <div className="md:col-span-2">
            <h3 className="text-2xl mb-2">📈 Archetype Distribution</h3>
            <div className="flex flex-wrap gap-4">
              {archetypeDistribution.map((item, index) => (
                <div key={index} className="p-2 border-2 border-clash-wood rounded-lg bg-white bg-opacity-60">
                  <p className="font-semibold">{item.archetype}: {item.percentage.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
