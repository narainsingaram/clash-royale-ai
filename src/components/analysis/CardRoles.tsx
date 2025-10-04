import React from 'react';
import { AnalysisResult, Card } from '../../types';

interface CardRolesProps {
  cardRoles: AnalysisResult['deckOverview']['cardRoles'];
  deck: Card[];
}

export default function CardRoles({ cardRoles, deck }: CardRolesProps) {
  return (
    <div className="bg-white bg-opacity-10 p-4 rounded-lg mb-4">
      <h3 className="text-2xl mb-2 flex items-center font-clash text-white">
        <div className="w-8 h-8 mr-2 bg-clash-purple text-white flex items-center justify-center font-bold rounded-md">C</div>
        Card Roles
      </h3>
      {Object.entries(cardRoles).map(([role, cardsInRole]) => (
        <div key={role} className="mb-2">
          <p className="font-semibold capitalize text-lg">{role.replace(/([A-Z])/g, ' $1').trim()}:</p>
          <div className="flex flex-wrap gap-2">
            {cardsInRole.map(cardName => {
              const card = deck.find(c => c.name === cardName);
              return card ? (
                <div key={card.id} className="text-center w-20">
                  <img src={card.iconUrls.medium} alt={card.name} className={`w-full clash-card clash-card-${card.rarity.toLowerCase()}`} />
                  <p className="text-xs font-semibold text-white" style={{ textShadow: '1px 1px 2px black' }}>{card.name}</p>
                </div>
              ) : null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
