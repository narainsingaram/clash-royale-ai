import React from 'react';
import { AnalysisResult, Card } from '../../types';

interface SuggestedImprovementsProps {
  suggestedImprovements: AnalysisResult['suggestedImprovements'];
  cards: Card[];
  handleTrySwap: (cardToReplaceName: string, cardToAddName: string) => void;
  openCardModal: (card: Card) => void;
}

export default function SuggestedImprovements({
  suggestedImprovements,
  cards,
  handleTrySwap,
  openCardModal,
}: SuggestedImprovementsProps) {
  return (
    <div className="bg-white bg-opacity-10 p-4 rounded-lg">
      <h3 className="text-2xl mb-2 flex items-center font-clash text-white">
        <div className="w-8 h-8 mr-2 bg-clash-gold text-white flex items-center justify-center font-bold rounded-md">I</div>
        Suggested Improvements
      </h3>
      <ul className="list-disc list-inside">
        {suggestedImprovements.map((imp, i) => (
          <li key={i} className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                Replace <span
                  className="font-semibold text-clash-blue cursor-pointer hover:underline"
                  onClick={() => {
                    const card = cards.find(c => c.name === imp.cardToReplace);
                    if (card) openCardModal(card);
                  }}
                >{imp.cardToReplace}</span> ({imp.reasonToReplace})
                with <span
                  className="font-semibold text-clash-blue cursor-pointer hover:underline"
                  onClick={() => {
                    const card = cards.find(c => c.name === imp.cardToAdd);
                    if (card) openCardModal(card);
                  }}
                >{imp.cardToAdd}</span> ({imp.reasonToAdd})
              </div>
              <button
                onClick={() => handleTrySwap(imp.cardToReplace, imp.cardToAdd)}
                className="clash-button text-sm ml-2"
              >
                Try Swap
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
