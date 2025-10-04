import React from 'react';
import { AnalysisResult } from '../../types';

interface DeckOverviewProps {
  deckOverview: AnalysisResult['deckOverview'];
}

export default function DeckOverview({ deckOverview }: DeckOverviewProps) {
  return (
    <div className="bg-white bg-opacity-10 p-4 rounded-lg mb-4">
      <h3 className="text-2xl mb-2 flex items-center font-clash text-white">
        <div className="w-8 h-8 mr-2 bg-clash-blue text-white flex items-center justify-center font-bold rounded-md">D</div>
        Deck Overview
      </h3>
      <p><strong>Archetype:</strong> {deckOverview.archetype}</p>
      <p><strong>Playstyle:</strong> {deckOverview.playstyle}</p>
      <p><strong>Elixir Comment:</strong> {deckOverview.elixirComment}</p>
    </div>
  );
}
