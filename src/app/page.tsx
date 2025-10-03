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
  winRate?: number; // Optional, as it comes from RoyaleAPI stats
  usageRate?: number; // Optional, as it comes from RoyaleAPI stats
}

interface AnalysisResult {
  deckOverview: {
    archetype: string;
    playstyle: string;
    elixirComment: string;
  };
  strengths: { title: string; description: string }[];
  weaknesses: { title: string; description: string }[];
  synergies: { title: string; description: string }[];
  suggestedImprovements: {
    cardToReplace: string;
    reasonToReplace: string;
    cardToAdd: string;
    reasonToAdd: string;
  }[];
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [addingCard, setAddingCard] = useState<Card | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [playerTag, setPlayerTag] = useState<string>('');
  const [importingDeck, setImportingDeck] = useState<boolean>(false);
  const [cardStats, setCardStats] = useState<Record<string, { winRate: number; usageRate: number }>>({});
  const [swappingCardId, setSwappingCardId] = useState<string | null>(null);
  const [swappedInCard, setSwappedInCard] = useState<Card | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch base cards data
      const cardsResponse = await fetch('/api/cards');
      const cardsData = await cardsResponse.json();

      // Fetch RoyaleAPI stats
      const statsResponse = await fetch('/api/royaleapi-stats');
      const statsData = await statsResponse.json();

      // Map stats to cards
      const statsMap: Record<string, { winRate: number; usageRate: number }> = {};
      if (statsData.cardStats) {
        statsData.cardStats.forEach((stat: any) => {
          statsMap[stat.id] = { winRate: stat.winRate, usageRate: stat.usageRate };
        });
      }
      setCardStats(statsMap);

      const mergedCards = cardsData.items.map((card: Card) => ({
        ...card,
        winRate: statsMap[card.id]?.winRate || 0,
        usageRate: statsMap[card.id]?.usageRate || 0,
      }));
      setCards(mergedCards);
    };

    fetchData();
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
      console.log('API Raw Response Data:', data); // Log raw data
      if (data.analysis) {
        try {
          const parsedAnalysis: AnalysisResult = JSON.parse(data.analysis);
          setAnalysis(parsedAnalysis);
        } catch (jsonError) {
          console.error('Failed to parse AI analysis JSON:', jsonError);
          setAnalysis(null); // Clear analysis if parsing fails
          alert('Failed to parse AI analysis. Please try again or check console for details.');
        }
      } else {
        setAnalysis(null);
        alert(data.error || 'AI analysis returned no data.');
      }
    } catch (error) {
      console.error('Error analyzing deck:', error); // Added console.error
      setAnalysis(null);
      alert('Failed to analyze deck. Please try again.');
    }
    finally {
      setAnalyzing(false);
    }
  };

  const generateRandomDeck = () => {
    const shuffled = cards.sort(() => 0.5 - Math.random());
    const newDeck = shuffled.slice(0, 8);
    setDeck(newDeck);
  };

  const importPlayerDeck = async () => {
    if (!playerTag) return;
    setImportingDeck(true);
    try {
      const response = await fetch(`/api/player/${playerTag}`);
      const data = await response.json();
      if (response.ok && data.decks && data.decks.length > 0) {
        // Merge imported cards with stats
        const importedDeckWithStats = data.decks[0].map((card: Card) => ({
          ...card,
          winRate: cardStats[card.id]?.winRate || 0,
          usageRate: cardStats[card.id]?.usageRate || 0,
        }));
        setDeck(importedDeckWithStats);
      } else {
        alert(data.error || 'Failed to import deck. Please check player tag.');
      }
    } catch (error) {
      alert('Failed to import deck. Please check player tag and try again.');
    }
    finally {
      setImportingDeck(false);
    }
  };

  const handleTrySwap = (cardToReplaceName: string, cardToAddName: string) => {
    const cardToReplace = deck.find(c => c.name === cardToReplaceName);
    const cardToAdd = cards.find(c => c.name === cardToAddName);

    if (cardToReplace && cardToAdd) {
      setSwappingCardId(cardToReplace.id); // Start animation for card leaving
      setSwappedInCard(cardToAdd); // Store card coming in for animation

      setTimeout(() => {
        const newDeck = deck.map(card =>
          card.id === cardToReplace.id ? cardToAdd : card
        );
        setDeck(newDeck);
        setAnalysis(null); // Clear analysis to prompt re-analysis of new deck
        setSwappingCardId(null); // End animation
        setSwappedInCard(null);
      }, 500); // Animation duration
    } else {
      alert('Could not perform swap. Card not found in deck or available cards.');
    }
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
        @keyframes card-out-animation {
          from {
            transform: scale(1) rotateY(0deg);
            opacity: 1;
          }
          to {
            transform: scale(0.5) rotateY(90deg);
            opacity: 0;
          }
        }
        @keyframes card-in-animation {
          from {
            transform: scale(0.5) rotateY(-90deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotateY(0deg);
            opacity: 1;
          }
        }
        .card-add-animation {
          animation: card-add-animation 0.5s ease-in-out;
        }
        .card-out-animation {
          animation: card-out-animation 0.5s ease-in-out forwards;
        }
        .card-in-animation {
          animation: card-in-animation 0.5s ease-in-out forwards;
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
              <div
                key={card.id}
                onClick={() => handleDeckCardClick(card)}
                className={`cursor-pointer text-center ${swappingCardId === card.id ? 'card-out-animation' : ''}`}
              >
                <Tilt glareEnable={true} glareMaxOpacity={0.8} glareColor="#ffffff" glarePosition="bottom" tiltMaxAngleX={10} tiltMaxAngleY={10}>
                  <img src={card.iconUrls.medium} alt={card.name} className="w-full" />
                </Tilt>
                <p className="text-sm font-semibold">{card.name}</p>
              </div>
            ))}
            {swappingCardId && swappedInCard && (
              <div key={swappedInCard.id} className="cursor-pointer text-center card-in-animation">
                <Tilt glareEnable={true} glareMaxOpacity={0.8} glareColor="#ffffff" glarePosition="bottom" tiltMaxAngleX={10} tiltMaxAngleY={10}>
                  <img src={swappedInCard.iconUrls.medium} alt={swappedInCard.name} className="w-full" />
                </Tilt>
                <p className="text-sm font-semibold">{swappedInCard.name}</p>
              </div>
            )}
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
              className="bg-green-500 text-white font-bold py-2 px-4 rounded mr-2"
            >
              AI Generate Deck
            </button>
            <input
              type="text"
              placeholder="#PLAYER_TAG"
              value={playerTag}
              onChange={e => setPlayerTag(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg mr-2"
            />
            <button
              onClick={importPlayerDeck}
              disabled={importingDeck}
              className="bg-purple-500 text-white font-bold py-2 px-4 rounded"
            >
              {importingDeck ? 'Importing...' : 'Import Deck'}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-8" role="alert">
            <strong className="font-bold">AI Analysis:</strong>
            <div className="mt-2 text-gray-800">
              <h3 className="text-xl font-bold mb-2">📊 Deck Overview</h3>
              <p><strong>Archetype:</strong> {analysis.deckOverview.archetype}</p>
              <p><strong>Playstyle:</strong> {analysis.deckOverview.playstyle}</p>
              <p><strong>Elixir Comment:</strong> {analysis.deckOverview.elixirComment}</p>

              <h3 className="text-xl font-bold mt-4 mb-2">💪 Strengths</h3>
              <ul className="list-disc list-inside">
                {analysis.strengths.map((s, i) => (
                  <li key={i}><strong>{s.title}:</strong> {s.description}</li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mt-4 mb-2">📉 Weaknesses</h3>
              <ul className="list-disc list-inside">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i}><strong>{w.title}:</strong> {w.description}</li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mt-4 mb-2">✨ Key Synergies</h3>
              <ul className="list-disc list-inside">
                {analysis.synergies.map((s, i) => (
                  <li key={i}><strong>{s.title}:</strong> {s.description}</li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mt-4 mb-2">💡 Suggested Improvements</h3>
              <ul className="list-disc list-inside">
                {analysis.suggestedImprovements.map((imp, i) => (
                  <li key={i} className="mb-2">
                    Replace <span
                      className="font-semibold text-blue-600 cursor-pointer hover:underline"
                      onClick={() => {
                        const card = cards.find(c => c.name === imp.cardToReplace);
                        if (card) openCardModal(card);
                      }}
                    >{imp.cardToReplace}</span> ({imp.reasonToReplace})
                    with <span
                      className="font-semibold text-blue-600 cursor-pointer hover:underline"
                      onClick={() => {
                        const card = cards.find(c => c.name === imp.cardToAdd);
                        if (card) openCardModal(card);
                      }}
                    >{imp.cardToAdd}</span> ({imp.reasonToAdd})
                    <button
                      onClick={() => handleTrySwap(imp.cardToReplace, imp.cardToAdd)}
                      className="ml-2 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                    >
                      Try This Swap
                    </button>
                  </li>
                ))}
              </ul>
            </div>
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
                {selectedCard.winRate !== undefined && (
                  <p className="text-lg"><span className="font-semibold">Win Rate:</span> {selectedCard.winRate.toFixed(2)}%</p>
                )}
                {selectedCard.usageRate !== undefined && (
                  <p className="text-lg"><span className="font-semibold">Usage Rate:</span> {selectedCard.usageRate.toFixed(2)}%</p>
                )}
                <p className="text-lg"><span className="font-semibold">Max Level:</span> {selectedCard.maxLevel}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}