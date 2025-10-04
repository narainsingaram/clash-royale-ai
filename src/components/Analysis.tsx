import React from 'react';
import { AnalysisResult, Card } from '../../types';
import DeckOverview from './analysis/DeckOverview';
import CardRoles from './analysis/CardRoles';
import AnalysisSection from './analysis/AnalysisSection';
import SuggestedImprovements from './analysis/SuggestedImprovements';

interface AnalysisProps {
  analysis: AnalysisResult;
  cards: Card[];
  deck: Card[];
  handleTrySwap: (cardToReplaceName: string, cardToAddName: string) => void;
  openCardModal: (card: Card) => void;
}

export default function Analysis({
  analysis,
  cards,
  deck,
  handleTrySwap,
  openCardModal,
}: AnalysisProps) {
  return (
    <div className="clash-panel mb-8">
      <h2 className="text-4xl mb-4 font-clash text-center text-clash-gold">AI Analysis</h2>
      <DeckOverview deckOverview={analysis.deckOverview} />
      <CardRoles cardRoles={analysis.deckOverview.cardRoles} deck={deck} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalysisSection title="Strengths" icon="S" items={analysis.strengths} color="clash-green" />
        <AnalysisSection title="Weaknesses" icon="W" items={analysis.weaknesses} color="clash-red" />
        <AnalysisSection title="Synergies" icon="S" items={analysis.synergies} color="clash-purple" />
      </div>
      <SuggestedImprovements
        suggestedImprovements={analysis.suggestedImprovements}
        cards={cards}
        handleTrySwap={handleTrySwap}
        openCardModal={openCardModal}
      />
    </div>
  );
}
