import React from 'react';
import Tilt from 'react-parallax-tilt';
import { Card } from '../types';

interface CardModalProps {
  selectedCard: Card;
  closeCardModal: () => void;
}

export default function CardModal({ selectedCard, closeCardModal }: CardModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="clash-panel max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl">{selectedCard.name}</h2>
          <button onClick={closeCardModal} className="text-clash-red hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <Tilt glareEnable={true} glareMaxOpacity={0.7} glareColor="#ffffff" glarePosition="all" tiltMaxAngleX={15} tiltMaxAngleY={15}>
            <img src={selectedCard.iconUrls.medium} alt={selectedCard.name} className={`w-32 mx-auto mb-4 clash-card clash-card-${selectedCard.rarity.toLowerCase()}`} />
          </Tilt>
          <p className="text-lg"><span className="font-semibold">Elixir Cost:</span> {selectedCard.elixirCost}</p>
          <p className="text-lg"><span className="font-semibold">Rarity:</span> {selectedCard.rarity}</p>
          <p className="text-lg"><span className="font-semibold">Max Level:</span> {selectedCard.maxLevel}</p>
        </div>
      </div>
    </div>
  );
}
