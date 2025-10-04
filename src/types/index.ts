export interface Card {
  id: string;
  name: string;
  iconUrls: {
    medium: string;
  };
  elixirCost: number;
  maxLevel: number;
  rarity: string;
}

export interface AnalysisResult {
  deckOverview?: {
    archetype: string;
    playstyle: string;
    elixirComment: string;
    cardRoles: {
      winConditions: string[];
      supportCards: string[];
      cycleCards: string[];
      defensiveCore: string[];
      spells: string[];
    };
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

export interface SimilarDeckMetaDeck {
  name: string;
  coreStrategy: string;
  similarityExplanation: string;
  keyDifferences: string;
  suggestedSwapsToMatch?: {
    cardToReplace: string;
    cardToAdd: string;
    reason: string;
  }[];
  cards: Card[];
  similarity: number;
}

export interface SimilarDeckResult {
  identifiedArchetype: string;
  similarMetaDecks: SimilarDeckMetaDeck[];
}

export interface PopularCard {
  name: string;
  count: number;
  iconUrls: { medium: string };
}

export interface PopularDeck {
  count: number;
  deck: Card[];
}

export interface ArchetypeDistributionItem {
  archetype: string;
  count: number;
  percentage: number;
}
