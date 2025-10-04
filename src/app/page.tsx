"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  AnalysisResult, 
  SimilarDeckResult, 
  PopularCard, 
  PopularDeck, 
  ArchetypeDistributionItem 
} from '../types';
import Deck from '../components/Deck';
import DeckActions from '../components/DeckActions';
import Analysis from '../components/Analysis';
import SimilarDecks from '../components/SimilarDecks';
import ElixirCurve from '../components/ElixirCurve';
import MetaInsights from '../components/MetaInsights';
import CardList from '../components/CardList';
import CardModal from '../components/CardModal';
import FloatingDeck from '../components/FloatingDeck';

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
  const [swappingCardId, setSwappingCardId] = useState<string | null>(null);
  const [swappedInCard, setSwappedInCard] = useState<Card | null>(null);
  const [findingSimilarDecks, setFindingSimilarDecks] = useState<boolean>(false);
  const [similarDecksAnalysis, setSimilarDecksAnalysis] = useState<SimilarDeckResult | null>(null);
  const [popularCards, setPopularCards] = useState<PopularCard[]>([]);
  const [popularDecks, setPopularDecks] = useState<PopularDeck[]>([]);
  const [archetypeDistribution, setArchetypeDistribution] = useState<ArchetypeDistributionItem[]>([]);
  const [fetchingMetaInsights, setFetchingMetaInsights] = useState<boolean>(false);
  const [isDeckInView, setIsDeckInView] = useState(true);

  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDeckInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (deckRef.current) {
      observer.observe(deckRef.current);
    }

    return () => {
      if (deckRef.current) {
        observer.unobserve(deckRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch base cards data
      const cardsResponse = await fetch('/api/cards');
      const cardsData = await cardsResponse.json();

      // Removed fetching RoyaleAPI stats here

      const mergedCards = cardsData.items.map((card: Card) => ({
        ...card,
        // Removed winRate and usageRate from here as well
      }));
      setCards(mergedCards);
    };

    fetchData();
  }, []);

  const fetchMetaInsights = async () => {
    setFetchingMetaInsights(true);
    try {
      // Trigger meta deck collection (will use cache if valid)
      await fetch('/api/collect-meta-decks');

      const [popularCardsRes, popularDecksRes, archetypeDistRes] = await Promise.all([
        fetch('/api/meta/popular-cards'),
        fetch('/api/meta/popular-decks'),
        fetch('/api/meta/archetype-distribution'),
      ]);

      const popularCardsData = await popularCardsRes.json();
      const popularDecksData = await popularDecksRes.json();
      const archetypeDistData = await archetypeDistRes.json();

      if (popularCardsData.popularCards) setPopularCards(popularCardsData.popularCards);
      if (popularDecksData.popularDecks) setPopularDecks(popularDecksData.popularDecks);
      if (archetypeDistData.archetypeDistribution) setArchetypeDistribution(archetypeDistData.archetypeDistribution);

    } catch (error) {
      console.error('Failed to fetch meta insights:', error);
      alert('Failed to fetch meta insights. Please try again.');
    } finally {
      setFetchingMetaInsights(false);
    }
  };

  // Fetch meta insights on initial load
  useEffect(() => {
    fetchMetaInsights();
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
        // Removed merging with cardStats here
        setDeck(data.decks[0]);
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

  const findSimilarDecks = async () => {
    setFindingSimilarDecks(true);
    setSimilarDecksAnalysis(null);
    try {
      const response = await fetch('/api/similar-decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userDeck: deck }),
      });
      const data = await response.json();
      console.log('Similar Decks Raw Data:', data);

      if (data.similarDecksData) {
        try {
          const parsedSimilarDecks: SimilarDeckResult = JSON.parse(data.similarDecksData);
          setSimilarDecksAnalysis(parsedSimilarDecks);
        } catch (jsonError) {
          console.error('Failed to parse AI similar decks JSON:', jsonError);
          alert('Failed to parse similar decks analysis. Please try again or check console for details.');
        }
      } else {
        alert(data.error || 'AI similar decks analysis returned no data.');
      }
    } catch (error) {
      console.error('Error finding similar decks:', error);
      alert('Failed to find similar decks. Please try again.');
    }
    finally {
      setFindingSimilarDecks(false);
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

  const getElixirDistribution = () => {
    const distribution: Record<number, number> = {};
    for (let i = 1; i <= 9; i++) {
      distribution[i] = 0;
    }
    deck.forEach(card => {
      if (card.elixirCost >= 1 && card.elixirCost <= 9) {
        distribution[card.elixirCost]++;
      }
    });
    return distribution;
  };

  const elixirDistribution = getElixirDistribution();
  const maxCardsAtAnyElixir = Math.max(...Object.values(elixirDistribution), 1); // Ensure at least 1 for division

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
      <div className="container mx-auto p-4 font-sans">
        <h1 className="text-5xl text-center mb-8 text-clash-gold" style={{ textShadow: '3px 3px 0px var(--clash-wood)' }}>Clash Royale AI Deck Analyzer</h1>

        <div ref={deckRef}>
          <Deck 
            deck={deck}
            swappingCardId={swappingCardId}
            swappedInCard={swappedInCard}
            handleDeckCardClick={handleDeckCardClick}
            calculateAverageElixir={calculateAverageElixir}
          />
        </div>

        <DeckActions
          deckLength={deck.length}
          analyzing={analyzing}
          importingDeck={importingDeck}
          findingSimilarDecks={findingSimilarDecks}
          playerTag={playerTag}
          analyzeDeck={analyzeDeck}
          generateRandomDeck={generateRandomDeck}
          importPlayerDeck={importPlayerDeck}
          findSimilarDecks={findSimilarDecks}
          setPlayerTag={setPlayerTag}
        />

        {analysis && 
          <Analysis 
            analysis={analysis} 
            cards={cards} 
            deck={deck} 
            handleTrySwap={handleTrySwap} 
            openCardModal={openCardModal} 
          />
        }

        {similarDecksAnalysis && <SimilarDecks similarDecksAnalysis={similarDecksAnalysis} />}

        <ElixirCurve elixirDistribution={elixirDistribution} maxCardsAtAnyElixir={maxCardsAtAnyElixir} />

        <MetaInsights 
          fetchingMetaInsights={fetchingMetaInsights}
          popularCards={popularCards}
          popularDecks={popularDecks}
          archetypeDistribution={archetypeDistribution}
        />

        <CardList 
          filteredCards={filteredCards}
          addingCard={addingCard}
          handleCardClick={handleCardClick}
          openCardModal={openCardModal}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {selectedCard && <CardModal selectedCard={selectedCard} closeCardModal={closeCardModal} />}

        {!isDeckInView && <FloatingDeck deck={deck} calculateAverageElixir={calculateAverageElixir} />}
      </div>
    </>
  );
}