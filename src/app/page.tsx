'use client';

import { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';

interface Card {
  id: string;
  name: string;
  iconUrls: {
    medium: string;
  };
  elixirCost: number;
  maxLevel: number;
  rarity: string;
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [addingCard, setAddingCard] = useState<Card | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

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
      setAddingCard(card);
      setTimeout(() => {
        setDeck([...deck, card]);
        setAddingCard(null);
      }, 500);
    }
  };

  const handleDeckCardClick = (card: Card) => {
    setDeck(deck.filter(c => c.id !== card.id));
  };

  const analyzeDeck = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deck }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      setAnalysis('Failed to analyze deck. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateRandomDeck = () => {
    const shuffled = cards.sort(() => 0.5 - Math.random());
    const newDeck = shuffled.slice(0, 8);
    setDeck(newDeck);
  };

  const calculateAverageElixir = () => {
    if (deck.length === 0) return 0;
    const totalElixir = deck.reduce((sum, card) => sum + card.elixirCost, 0);
    return (totalElixir / deck.length).toFixed(1);
  };

  const openCardModal = (card: Card) => {
    setSelectedCard(card);
  };

  const closeCardModal = () => {
    setSelectedCard(null);
  };

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style jsx>{`
        @keyframes card-add-animation {
          from {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          to {
            transform: scale(0.5) translateY(-200px);
            opacity: 0;
          }
        }
        .card-add-animation {
          animation: card-add-animation 0.5s ease-in-out;
        }
        .card-container .info-icon {
          display: none;
        }
        .card-container:hover .info-icon {
          display: block;
        }
        .card-container .use-button {
          display: none;
        }
        .card-container:hover .use-button {
          display: block;
        }
      `}</style>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Clash Royale AI Deck Analyzer</h1>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Deck</h2>
            <div className="text-xl font-semibold">
              Average Elixir: {calculateAverageElixir()}
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 bg-gray-200 p-4 rounded-lg">
            {deck.map(card => (
              <div key={card.id} onClick={() => handleDeckCardClick(card)} className="cursor-pointer text-center">
                <Tilt glareEnable={true} glareMaxOpacity={0.8} glareColor="#ffffff" glarePosition="bottom" tiltMaxAngleX={10} tiltMaxAngleY={10}>
                  <img src={card.iconUrls.medium} alt={card.name} className="w-full" />
                </Tilt>
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
              disabled={deck.length !== 8 || analyzing}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 mr-2"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Deck'}
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
            <div className="prose" dangerouslySetInnerHTML={{ __html: analysis }} />
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
              <div key={card.id} className={`relative card-container ${addingCard?.id === card.id ? 'card-add-animation' : ''}`}>
                <Tilt glareEnable={true} glareMaxOpacity={0.8} glareColor="#ffffff" glarePosition="bottom" tiltMaxAngleX={10} tiltMaxAngleY={10}>
                  <img src={card.iconUrls.medium} alt={card.name} className="w-full" />
                </Tilt>
                <p className="text-sm font-semibold text-center">{card.name}</p>
                <div
                  className="info-icon absolute top-0 right-0 bg-gray-800 text-white rounded-full p-1 cursor-pointer"
                  onClick={() => openCardModal(card)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="use-button absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center py-1 cursor-pointer" onClick={() => handleCardClick(card)}>
                  Use
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedCard.name}</h2>
                <button onClick={closeCardModal} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                <Tilt glareEnable={true} glareMaxOpacity={0.8} glareColor="#ffffff" glarePosition="bottom" tiltMaxAngleX={10} tiltMaxAngleY={10}>
                  <img src={selectedCard.iconUrls.medium} alt={selectedCard.name} className="w-32 mx-auto mb-4" />
                </Tilt>
                <p className="text-lg"><span className="font-semibold">Elixir Cost:</span> {selectedCard.elixirCost}</p>
                <p className="text-lg"><span className="font-semibold">Rarity:</span> {selectedCard.rarity}</p>
                <p className="text-lg"><span className="font-semibold">Max Level:</span> {selectedCard.maxLevel}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
