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
    <div className="text-center mt-4 flex justify-center items-center flex-wrap gap-4">
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
      <div className="flex items-center">
        <input
          type="text"
          placeholder="#PLAYER_TAG"
          value={playerTag}
          onChange={e => setPlayerTag(e.target.value)}
          className="p-2 border-2 border-clash-wood rounded-lg bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-clash-gold"
        />
        <button
          onClick={importPlayerDeck}
          disabled={importingDeck}
          className="clash-button ml-2"
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
