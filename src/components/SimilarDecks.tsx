import React from 'react';
import { SimilarDeckResult, Card } from '../types';

interface SimilarDecksProps {
  similarDecksAnalysis: SimilarDeckResult;
}

export default function SimilarDecks({ similarDecksAnalysis }: SimilarDecksProps) {
  return (
    <div className="clash-panel mb-8">
      <h2 className="text-3xl mb-4 flex items-center"><div className="w-8 h-8 mr-2 bg-clash-blue text-white flex items-center justify-center font-bold rounded-md">S</div> Similar Meta Decks</h2>
      <div className="text-gray-800">
        <p><strong>Identified Archetype:</strong> {similarDecksAnalysis.identifiedArchetype}</p>
        {similarDecksAnalysis.similarMetaDecks.map((metaDeck, index) => (
          <div key={index} className="mt-4 p-3 border-2 border-clash-wood rounded-lg bg-white bg-opacity-60">
            <h4 className="text-2xl">{metaDeck.name} ({ (metaDeck.similarity * 100).toFixed(1) } % Match)</h4>
            <p className="text-sm"><strong>Core Strategy:</strong> {metaDeck.coreStrategy}</p>
            <p className="text-sm"><strong>Similarity:</strong> {metaDeck.similarityExplanation}</p>
            <p className="text-sm"><strong>Key Differences:</strong> {metaDeck.keyDifferences}</p>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-2">
              {metaDeck.cards.map(card => (
                <div key={card.id} className="text-center w-16">
                  <img src={card.iconUrls.medium} alt={card.name} className={`w-full clash-card clash-card-${card.rarity.toLowerCase()}`} />
                  <p className="text-xs">{card.name}</p>
                </div>
              ))}
            </div>
            {metaDeck.suggestedSwapsToMatch && metaDeck.suggestedSwapsToMatch.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Suggested Swaps to Match:</p>
                <ul className="list-disc list-inside text-sm">
                  {metaDeck.suggestedSwapsToMatch.map((swap, i) => (
                    <li key={i}>
                      Replace <strong>{swap.cardToReplace}</strong> with <strong>{swap.cardToAdd}</strong> ({swap.reason})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
