import React from 'react';
import { AnalysisResult, Card } from '../types';
import { CheckCircle, XCircle, Zap, Lightbulb } from 'lucide-react';

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
    <div className="clash-panel mb-8 p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">AI Analysis</h2>

      {/* Deck Overview */}
      <Section title="Deck Overview" badge="D" color="blue">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
          <p><span className="font-semibold">Archetype:</span> {analysis.deckOverview.archetype}</p>
          <p><span className="font-semibold">Playstyle:</span> {analysis.deckOverview.playstyle}</p>
          <p><span className="font-semibold">Elixir:</span> {analysis.deckOverview.elixirComment}</p>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Card Roles</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(analysis.deckOverview.cardRoles).map(([role, cardsInRole]) => (
              <div key={role}>
                <p className="capitalize text-gray-800 mb-1">{role.replace(/([A-Z])/g, ' $1').trim()}:</p>
                <div className="flex flex-wrap gap-2">
                  {cardsInRole.map(cardName => {
                    const card = deck.find(c => c.name === cardName);
                    return card ? (
                      <div key={card.id} className="w-14 text-center">
                        <img
                          src={card.iconUrls.medium}
                          alt={card.name}
                          className={`w-full clash-card clash-card-${card.rarity.toLowerCase()} rounded-md shadow`}
                        />
                        <p className="text-xs mt-1 truncate">{card.name}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Strengths */}
      <Section title="Strengths" badge="S" color="green" icon={<CheckCircle className="w-5 h-5" />}>
        <List items={analysis.strengths} />
      </Section>

      {/* Weaknesses */}
      <Section title="Weaknesses" badge="W" color="red" icon={<XCircle className="w-5 h-5" />}>
        <List items={analysis.weaknesses} />
      </Section>

      {/* Synergies */}
      <Section title="Key Synergies" badge="S" color="purple" icon={<Zap className="w-5 h-5" />}>
        <List items={analysis.synergies} />
      </Section>

      {/* Improvements */}
      <Section title="Suggested Improvements" badge="I" color="yellow" icon={<Lightbulb className="w-5 h-5" />}>
        <ul className="space-y-3 text-sm text-gray-700">
          {analysis.suggestedImprovements.map((imp, i) => (
            <li key={i} className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <span>
                Replace <ClickableCard name={imp.cardToReplace} cards={cards} openCardModal={openCardModal} /> 
                <span className="text-gray-500"> ({imp.reasonToReplace})</span>
                &nbsp;with <ClickableCard name={imp.cardToAdd} cards={cards} openCardModal={openCardModal} /> 
                <span className="text-gray-500"> ({imp.reasonToAdd})</span>
              </span>
              <button
                onClick={() => handleTrySwap(imp.cardToReplace, imp.cardToAdd)}
                className="clash-button text-xs px-2 py-1"
              >
                Try Swap
              </button>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* --- Reusable Section Component --- */
function Section({ title, badge, color, children, icon }: { title: string, badge: string, color: string, children: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 flex items-center justify-center rounded-md text-white font-bold bg-clash-${color}`}>
          {badge}
        </div>
        {icon && <span className="text-gray-700">{icon}</span>}
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

/* --- Reusable List Renderer --- */
function List({ items }: { items: { title: string; description: string }[] }) {
  return (
    <ul className="space-y-2 text-sm text-gray-700">
      {items.map((item, i) => (
        <li key={i}>
          <span className="font-semibold">{item.title}:</span> {item.description}
        </li>
      ))}
    </ul>
  );
}

/* --- Clickable Card Modal Trigger --- */
function ClickableCard({ name, cards, openCardModal }: { name: string; cards: Card[]; openCardModal: (c: Card) => void }) {
  const card = cards.find(c => c.name === name);
  return (
    <span
      className="font-semibold text-clash-blue cursor-pointer hover:underline"
      onClick={() => card && openCardModal(card)}
    >
      {name}
    </span>
  );
}
