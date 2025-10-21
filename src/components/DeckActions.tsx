import React from 'react';

interface DeckActionsProps {
  deckLength: number;
  analyzing: boolean;
  importingDeck: boolean;
  findingSimilarDecks: boolean;
  playerTag: string;
  analyzeDeck: () => void;
  generateRandomDeck: () => void;
  importPlayerDeck: () => void;
  findSimilarDecks: () => void;
  setPlayerTag: (tag: string) => void;
}

export default function DeckActions({
  deckLength,
  analyzing,
  importingDeck,
  findingSimilarDecks,
  playerTag,
  analyzeDeck,
  generateRandomDeck,
  importPlayerDeck,
  findSimilarDecks,
  setPlayerTag,
}: DeckActionsProps) {
  return (
    <div className="text-center mt-4 flex flex-wrap justify-center items-center gap-4">
      <button
        onClick={analyzeDeck}
        disabled={deckLength !== 8 || analyzing}
        className="clash-button"
      >
        {analyzing ? 'Analyzing...' : 'Analyze Deck'}
      </button>
      <button
        onClick={generateRandomDeck}
        className="clash-button"
      >
        AI Generate Deck
      </button>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="#PLAYER_TAG"
          value={playerTag}
          onChange={e => setPlayerTag(e.target.value)}
          className="p-3 border-2 border-clash-wood rounded-lg bg-clash-wood bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-clash-gold text-clash-wood w-48"
        />
        <button
          onClick={importPlayerDeck}
          disabled={importingDeck}
          className="clash-button"
        >
          {importingDeck ? 'Importing...' : 'Import'}
        </button>
      </div>
      <button
        onClick={findSimilarDecks}
        disabled={deckLength !== 8 || findingSimilarDecks}
        className="clash-button"
      >
        {findingSimilarDecks ? 'Finding...' : 'Find Similar Decks'}
      </button>
    </div>
  );
}
