'use client';

import { useState, useEffect } from 'react';

interface Card {
  id: string;
  name: string;
  iconUrls: {
    medium: string;
  };
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchCards = async () => {
      const response = await fetch('/api/cards');
      const data = await response.json();
      setCards(data.items);
    };

    fetchCards();
  }, []);

  const handleCardClick = (card: Card) => {
    if (deck.length < 8 && !deck.find(c => c.id === card.id)) {
      setDeck([...deck, card]);
    }
  };

  const handleDeckCardClick = (card: Card) => {
    setDeck(deck.filter(c => c.id !== card.id));
  };

  const analyzeDeck = () => {
    // AI analysis logic will go here
    setAnalysis('Deck analysis coming soon!');
  };

  const generateRandomDeck = () => {
    const shuffled = cards.sort(() => 0.5 - Math.random());
    const newDeck = shuffled.slice(0, 8);
    setDeck(newDeck);
  };

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Clash Royale AI Deck Analyzer</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Deck</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 bg-gray-200 p-4 rounded-lg">
          {deck.map(card => (
            <div key={card.id} onClick={() => handleDeckCardClick(card)} className="cursor-pointer text-center">
              <img src={card.iconUrls.medium} alt={card.name} className="w-full" />
              <p className="text-sm font-semibold">{card.name}</p>
            </div>
          ))}
          {[...Array(8 - deck.length)].map((_, i) => (
            <div key={i} className="w-full h-full bg-gray-300 rounded-lg" />
          ))}
        </div>
        <div className="text-center mt-4">
          <button
            onClick={analyzeDeck}
            disabled={deck.length !== 8}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 mr-2"
          >
            Analyze Deck
          </button>
          <button
            onClick={generateRandomDeck}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded"
          >
            AI Generate Deck
          </button>
        </div>
      </div>

      {analysis && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-8" role="alert">
          <strong className="font-bold">AI Analysis:</strong>
          <span className="block sm:inline"> {analysis}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Cards</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for cards..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
          {filteredCards.map(card => (
            <div key={card.id} onClick={() => handleCardClick(card)} className="cursor-pointer text-center">
              <img src={card.iconUrls.medium} alt={card.name} className="w-full" />
              <p className="text-sm font-semibold">{card.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}