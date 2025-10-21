'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Card } from '../types';
import dynamic from 'next/dynamic';

// Dynamic import for the ForceGraph2D component to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => <div>Loading graph...</div>
});

// Define dynamic card synergy relationships based on meta trends
const getDynamicCardSynergies = () => {
  // This would typically come from an API that provides current meta data
  // For now, I'll provide a more comprehensive and adaptive set of synergies
  return {
    // Hog Cycle synergies
    'Hog Rider': {
      'Musketeer': { type: 'support', strength: 0.8, metaWeight: 0.9, description: 'Musketeer provides ranged support for Hog pushes' },
      'Ice Golem': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Ice Golem tanks and slows enemies for Hog' },
      'Fireball': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Fireball clears enemy swarms blocking Hog path' },
      'The Log': { type: 'support', strength: 0.9, metaWeight: 0.95, description: 'The Log provides instant bridge damage and protection' },
      'Skeletons': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Skeletons provide additional chip damage on pushes' },
      'Cannon': { type: 'defense', strength: 0.7, metaWeight: 0.7, description: 'Cannon defends against air while Hog pushes ground' },
      'Ice Spirit': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Ice Spirit helps control enemy positioning for Hog' },
      'Knight': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Knight provides extra tank support for Hog pushes' }
    },
    'Musketeer': {
      'Hog Rider': { type: 'support', strength: 0.8, metaWeight: 0.9, description: 'Musketeer provides ranged damage support for Hog pushes' },
      'Fireball': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Fireball protects Musketeer from swarm units' },
      'The Log': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'The Log protects Musketeer from retaliation' },
      'Ice Golem': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Ice Golem tanks for Musketeer and synergizes with her damage' },
      'Ice Spirit': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Ice Spirit helps control enemy positioning for Musketeer' },
      'Knight': { type: 'defense', strength: 0.5, metaWeight: 0.5, description: 'Knight provides additional defense for Musketeer' }
    },
    'Ice Golem': {
      'Hog Rider': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Ice Golem tanks for Hog and slows enemy defenders' },
      'Musketeer': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Ice Golem protects Musketeer from close-range threats' },
      'Fireball': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Fireball clears swarms threatening the Ice Golem tank' },
      'The Log': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'The Log provides additional protection for Ice Golem' },
      'Skeletons': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Skeletons provide additional chip damage after Ice Golem explodes' },
      'Knight': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Knight provides additional tanking support for the combo' },
      'Baby Dragon': { type: 'defense', strength: 0.7, metaWeight: 0.8, description: 'Baby Dragon provides aerial defense for Ice Golem' }
    },
    'Fireball': {
      'Hog Rider': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Fireball clears defensive swarms blocking Hog path' },
      'Musketeer': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Fireball protects Musketeer from swarm units' },
      'Ice Golem': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Fireball clears swarms targeting the Ice Golem' },
      'The Log': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'The Log and Fireball combo clears key defensive units' },
      'Cannon': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Fireball protects Cannon from swarm attacks' },
      'Ice Spirit': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Fireball enhances the damage potential of Ice Spirit' },
      'Knight': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Fireball protects Knight from swarm units' }
    },
    'The Log': {
      'Hog Rider': { type: 'support', strength: 0.9, metaWeight: 0.95, description: 'The Log provides instant bridge damage and protection for Hog' },
      'Musketeer': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'The Log protects Musketeer from retaliation' },
      'Ice Golem': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'The Log protects Ice Golem while it tanks' },
      'Fireball': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'The Log and Fireball combo efficiently removes defensive units' },
      'Skeletons': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'The Log supports Skeletons with slow effect' },
      'Cannon': { type: 'defense', strength: 0.6, metaWeight: 0.7, description: 'The Log protects Cannon from direct attacks' },
      'Knight': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'The Log provides protection for Knight' }
    },
    // Golem synergies
    'Golem': {
      'Night Witch': { type: 'support', strength: 0.9, metaWeight: 0.9, description: 'Night Witch provides flying support while Golem tanks' },
      'Baby Dragon': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Baby Dragon provides aerial defense for Golem' },
      'Mega Minion': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Mega Minion provides air support for Golem pushes' },
      'Lumberjack': { type: 'support', strength: 0.8, metaWeight: 0.85, description: 'Lumberjack becomes a tank when Golem dies' },
      'Lightning': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Lightning removes key defensive structures for Golem' },
      'Tornado': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Tornado groups enemy units for Golem to damage' },
      'Elixir Collector': { type: 'support', strength: 0.8, metaWeight: 0.85, description: 'Collector generates elixir for expensive Golem' }
    },
    'Night Witch': {
      'Golem': { type: 'support', strength: 0.9, metaWeight: 0.9, description: 'Golem provides tanking while Night Witch spawns bats' },
      'Baby Dragon': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Baby Dragon covers Night Witch from air attacks' },
      'Mega Minion': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Mega Minion provides additional air support' },
      'Lumberjack': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Lumberjack supports the flying unit combination' },
      'Elixir Collector': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Collector supports the high-elixir unit combination' }
    },
    'Baby Dragon': {
      'Golem': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Baby Dragon provides air defense for Golem' },
      'Night Witch': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Baby Dragon and Night Witch synergize for air control' },
      'Mega Minion': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Both provide air support for deck' },
      'Lumberjack': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Lumberjack complements Baby Dragon as flying support' },
      'Lightning': { type: 'defense', strength: 0.5, metaWeight: 0.6, description: 'Lightning protects flying units from defenses' },
      'Tornado': { type: 'defense', strength: 0.5, metaWeight: 0.6, description: 'Tornado helps flying units target grouped enemies' }
    },
    // X-Bow synergies
    'X-Bow': {
      'Tesla': { type: 'defense', strength: 0.8, metaWeight: 0.9, description: 'Tesla protects X-Bow from ground attacks' },
      'Archers': { type: 'defense', strength: 0.7, metaWeight: 0.8, description: 'Archers provide additional defense for X-Bow' },
      'Skeletons': { type: 'defense', strength: 0.6, metaWeight: 0.7, description: 'Skeletons tank for X-Bow and provide chip damage' },
      'Ice Golem': { type: 'defense', strength: 0.6, metaWeight: 0.7, description: 'Ice Golem tanks for X-Bow and slows attackers' },
      'The Log': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'The Log protects X-Bow from hasty units' },
      'Fireball': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Fireball clears swarm units threatening X-Bow' },
      'Knight': { type: 'defense', strength: 0.5, metaWeight: 0.6, description: 'Knight provides tank defense for X-Bow' }
    },
    // Spell Bait synergies
    'Goblin Barrel': {
      'Princess': { type: 'support', strength: 0.8, metaWeight: 0.85, description: 'Princess provides long-range bait support' },
      'Inferno Tower': { type: 'defense', strength: 0.9, metaWeight: 0.95, description: 'Inferno Tower defends against high-health threats' },
      'Knight': { type: 'defense', strength: 0.6, metaWeight: 0.7, description: 'Knight provides tank defense for spell bait combo' },
      'The Log': { type: 'defense', strength: 0.6, metaWeight: 0.7, description: 'The Log provides quick defense for spell bait' },
      'Rocket': { type: 'support', strength: 0.8, metaWeight: 0.9, description: 'Rocket provides high-damage punishment for baited troops' },
      'Ice Spirit': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Ice Spirit slows enemies for bait effect' },
      'Goblin Gang': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Goblin Gang provides additional bait units' }
    },
    // Lavaloon synergies
    'Lava Hound': {
      'Balloon': { type: 'support', strength: 0.8, metaWeight: 0.9, description: 'Balloon provides additional air damage after Lava Hound dies' },
      'Mega Minion': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Mega Minion provides air support and protection' },
      'Inferno Dragon': { type: 'support', strength: 0.8, metaWeight: 0.9, description: 'Inferno Dragon provides targeted air defense' },
      'Arrows': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Arrows clear swarm units threatening Lava Hound' },
      'Zap': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Zap stuns enemies and protects Lava Hound' },
      'Tombstone': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Tombstone provides additional support units' },
      'Minions': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Minions provide additional air damage' }
    },
    'Balloon': {
      'Lava Hound': { type: 'support', strength: 0.8, metaWeight: 0.9, description: 'Lava Hound tanks for Balloon and dies to provide damage' },
      'Mega Minion': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Mega Minion provides protection and support' },
      'Inferno Dragon': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Inferno Dragon protects Balloon from other air units' },
      'Minions': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Minions provide additional air damage' }
    },
    // General defensive synergies
    'Tombstone': {
      'Skeletons': { type: 'support', strength: 0.8, metaWeight: 0.85, description: 'Skeletons provide both offensive and defensive potential' },
      'Musketeer': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Musketeer provides ranged defense while Tombstone spawns' },
      'Arrows': { type: 'defense', strength: 0.5, metaWeight: 0.6, description: 'Arrows protect Tombstone from swarm units' },
      'Fireball': { type: 'defense', strength: 0.6, metaWeight: 0.7, description: 'Fireball protects Tombstone from threats' },
      'The Log': { type: 'defense', strength: 0.5, metaWeight: 0.6, description: 'The Log provides protection for Tombstone' },
      'Goblin Gang': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Goblin Gang provides additional defensive units' }
    },
    'Cannon': {
      'Hog Rider': { type: 'defense', strength: 0.8, metaWeight: 0.85, description: 'Cannon defends while Hog Rider pushes on other lane' },
      'Musketeer': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Musketeer provides additional ranged defense' },
      'Fireball': { type: 'defense', strength: 0.5, metaWeight: 0.6, description: 'Fireball protects Cannon from swarm attacks' },
      'The Log': { type: 'defense', strength: 0.6, metaWeight: 0.7, description: 'The Log provides protection for Cannon' },
      'Skeletons': { type: 'defense', strength: 0.5, metaWeight: 0.6, description: 'Skeletons provide additional defensive presence' }
    },
    
    // Cycle cards synergies
    'Skeletons': {
      'Fireball': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Fireball can clear skeletons for damage' },
      'The Log': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'The Log and skeletons provide efficient elixir use' },
      'Ice Spirit': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Both provide cheap elixir cycling options' },
      'Knight': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Knight and skeletons provide balanced ground defense' }
    },
    'Ice Spirit': {
      'Skeletons': { type: 'support', strength: 0.7, metaWeight: 0.8, description: 'Both provide cheap elixir cycling options' },
      'Fireball': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Fireball synergizes with Ice Spirit for damage' },
      'The Log': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Both provide efficient elixir usage' },
      'Hog Rider': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Ice Spirit helps control enemy positioning before Hog push' }
    },
    'Knight': {
      'Hog Rider': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Knight provides additional tank support' },
      'Musketeer': { type: 'support', strength: 0.6, metaWeight: 0.7, description: 'Knight and Musketeer provide balanced ground army' },
      'Ice Golem': { type: 'support', strength: 0.5, metaWeight: 0.6, description: 'Knight supports Ice Golem with additional tanking' },
      'Cannon': { type: 'defense', strength: 0.6, metaWeight: 0.7, description: 'Knight provides ground defense for Cannon' }
    }
  };
};

// Creative synergy types for more adaptive visualization
const CREATIVE_SYNERGY_TYPES = {
  'combo': {
    name: 'Combo',
    description: 'Cards that work together in sequence',
    color: '#8b5cf6', // purple
    priority: 1
  },
  'counter': {
    name: 'Counter',
    description: 'Cards that counter specific threats',
    color: '#ef4444', // red
    priority: 2
  },
  'cycle': {
    name: 'Cycle',
    description: 'Cards that enable efficient elixir usage',
    color: '#06b6d4', // cyan
    priority: 3
  },
  'tank': {
    name: 'Tank',
    description: 'Cards that tank damage for others',
    color: '#10b981', // green
    priority: 4
  },
  'support': {
    name: 'Support',
    description: 'Cards that enhance other cards',
    color: '#f59e0b' // amber
  },
  'control': {
    name: 'Control',
    description: 'Cards that control battlefield positioning',
    color: '#ec4899' // pink
  }
};

// Helper function to determine creative synergy type
const determineCreativeType = (card1Name: string, card2Name: string, baseType: string): string => {
  // More creative and adaptive classification based on card functions
  const cardPair = [card1Name, card2Name].sort().join('-');
  
  // Specific creative pairings based on card roles
  if (cardPair.includes('Golem') && cardPair.includes('Night Witch')) return 'tank';
  if (cardPair.includes('Lava Hound') && cardPair.includes('Balloon')) return 'combo';
  if (cardPair.includes('Hog Rider') && cardPair.includes('The Log')) return 'combo';
  if (cardPair.includes('Inferno Tower') && cardPair.includes('Goblin Barrel')) return 'counter';
  if (cardPair.includes('Ice Golem') && cardPair.includes('Musketeer')) return 'tank';
  if (cardPair.includes('Fireball') && cardPair.includes('Ice Spirit')) return 'combo';
  if (cardPair.includes('Tornado') && (cardPair.includes('Golem') || cardPair.includes('Lava Hound'))) return 'control';
  
  // Based on the base type
  if (baseType === 'defense') return 'control';
  if (baseType === 'support') return 'support';
  if (baseType === 'cycle') return 'cycle';
  
  return baseType; // fallback to base type
};

// Helper function to find missing key synergies in a deck
const findMissingKeySynergies = (deck: Card[]): any[] => {
  const cardNames = deck.map(card => card.name);
  const cardSynergies = getDynamicCardSynergies();
  const missing: any[] = [];
  
  // For each card in the deck, check if it's missing key synergies
  deck.forEach(card => {
    const synergies = cardSynergies[card.name] || {};
    
    // Look for missing synergies with high meta weight
    Object.entries(synergies).forEach(([otherCardName, synergyData]: [string, any]) => {
      if (synergyData.metaWeight > 0.8 && !cardNames.includes(otherCardName)) {
        // This is a key synergy that's missing from the deck
        missing.push({
          card1: card,
          card2: { name: otherCardName }, // placeholder object
          type: synergyData.type,
          strength: synergyData.strength,
          metaWeight: synergyData.metaWeight,
          description: `Missing strong synergy with ${otherCardName}`,
          creativeType: determineCreativeType(card.name, otherCardName, synergyData.type)
        });
      }
    });
  });
  
  return missing;
};

interface SynergyVisualizerProps {
  deck: Card[];
  cards: Card[];
  highlightedCards: string[];
}

interface Node {
  id: string;
  name: string;
  type: 'deck' | 'highlighted';
  elixirCost: number;
  img: string;
  archetypalRole?: string; // e.g. "tank", "damage", "cycle"
}

interface Link {
  source: string;
  target: string;
  type: string; // 'support', 'defense', 'offense', etc.
  strength: number; // 0-1 scale
  metaWeight: number; // 0-1 scale based on current meta relevance
  description: string;
  creativeType?: string; // Enhanced synergy type for creative visualization
}

export default function SynergyVisualizer({ 
  deck, 
  cards, 
  highlightedCards 
}: SynergyVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const fgRef = useRef<any>();

  useEffect(() => {
    // Only create nodes for cards in the deck
    const deckNodes: Node[] = deck.map(card => ({
      id: card.id,
      name: card.name,
      type: highlightedCards.includes(card.name) ? 'highlighted' : 'deck',
      elixirCost: card.elixirCost,
      img: card.iconUrls.medium
    }));

    // Create links based on synergies between cards ONLY in the deck
    const deckLinks: Link[] = [];
    const processedPairs = new Set<string>();
    const cardSynergies = getDynamicCardSynergies();

    deck.forEach(card1 => {
      deck.forEach(card2 => {
        if (card1.id !== card2.id) {
          const pairKey = [card1.id, card2.id].sort().join('-');
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);

            // Check if there's a synergy between these cards based on current meta
            const synergy = cardSynergies[card1.name]?.[card2.name];
            if (synergy) {
              // Calculate combined strength based on synergy strength and meta weight
              const combinedStrength = (synergy.strength * 0.7) + (synergy.metaWeight * 0.3);
              
              deckLinks.push({
                source: card1.id,
                target: card2.id,
                type: synergy.type,
                strength: combinedStrength,
                metaWeight: synergy.metaWeight,
                description: synergy.description,
                creativeType: determineCreativeType(card1.name, card2.name, synergy.type)
              });
            }
          }
        }
      });
    });

    // Determine if there are missing key synergies in the deck
    const missingSynergies = findMissingKeySynergies(deck);
    if (missingSynergies.length > 0) {
      // Add virtual nodes to represent missing synergies for visualization
      // This will help users see what synergies are missing
      missingSynergies.forEach((missing, index) => {
        const virtualNodeId = `missing-${index}`;
        
        // Add virtual nodes for missing synergies
        deckLinks.push({
          source: missing.card1.id,
          target: missing.card2.id,
          type: missing.type,
          strength: missing.strength * 0.7, // Show as weaker since it's missing
          metaWeight: missing.metaWeight || 0.9,
          description: `MISSING: ${missing.description}`,
          creativeType: missing.creativeType
        });
      });
    }

    // Set the deck nodes and links
    setNodes(deckNodes);
    setLinks(deckLinks);

    // Auto-center and zoom to fit after a brief delay
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400);
      }
    }, 100);
  }, [deck, highlightedCards]);

  // Color mapping for nodes
  const getNodeColor = (node: Node) => {
    switch (node.type) {
      case 'deck':
        return '#3b82f6'; // blue-500
      case 'highlighted':
        return '#f59e0b'; // amber-500
      default:
        return '#d1d5db'; // gray-300
    }
  };

  // Calculate node size based on elixir cost
  const getNodeSize = (node: Node) => {
    return 15 + (node.elixirCost * 2); // Base size + elixir cost factor
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">Deck Synergy Matrix</h2>
        <p className="text-sm text-gray-500 mt-1">
          Visualizes dynamic synergies within your deck based on current meta trends
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs">Deck Cards</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
              <span className="text-xs">Highlighted Cards</span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            {Object.entries(CREATIVE_SYNERGY_TYPES).map(([type, data]) => (
              <div key={type} className="flex items-center">
                <div className="w-3 h-0.5" style={{ backgroundColor: data.color, marginRight: '4px' }}></div>
                <span className="text-xs capitalize" title={data.description}>{type}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-96 w-full border border-gray-200 rounded-lg overflow-hidden relative">
          {nodes.length > 0 ? (
            <ForceGraph2D
              ref={fgRef}
              graphData={{ nodes, links }}
              nodeLabel={(node: any) => `${node.name}\nElixir: ${node.elixirCost}`}
              nodeAutoColorBy="type"
              nodeVal={node => getNodeSize(node as Node)}
              nodeColor={node => getNodeColor(node as Node)}
              nodeCanvasObject={(node, ctx, globalScale) => {
                // Draw image if available
                if (node.img) {
                  const image = new Image();
                  image.src = node.img || '';
                  
                  const label = node.name as string;
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  
                  // Draw image on node
                  const size = getNodeSize(node as Node);
                  ctx.drawImage(
                    image,
                    node.x! - size/2,
                    node.y! - size/2,
                    size,
                    size
                  );
                  
                  // Draw label below image
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                  
                  // Draw different label for highlighted cards
                  if (node.type === 'highlighted') {
                    ctx.fillStyle = 'rgba(245, 158, 11, 0.9)'; // amber-500
                    ctx.font = `bold ${fontSize}px Sans-Serif`;
                  }
                  
                  ctx.fillText(label, node.x!, node.y! + size/2 + 1);
                }
              }}
              linkColor={link => {
                const linkData = link as Link;
                // Use creative type color if available, otherwise use base type
                if (linkData.creativeType && CREATIVE_SYNERGY_TYPES[linkData.creativeType]) {
                  return CREATIVE_SYNERGY_TYPES[linkData.creativeType].color;
                }
                return '#6b7280'; // gray-500 as fallback
              }}
              linkWidth={link => {
                const linkData = link as Link;
                // Adjust width based on both strength and meta weight
                const baseWidth = linkData.strength * 2;
                const metaAdjustment = linkData.metaWeight || 1;
                return baseWidth * metaAdjustment;
              }}
              linkDirectionalArrowLength={3}
              linkDirectionalArrowRelPos={0.5}
              linkDirectionalParticles={link => {
                const linkData = link as Link;
                // Show particles for high meta weight synergies
                return linkData.metaWeight && linkData.metaWeight > 0.7 ? linkData.strength * 2 : 0;
              }}
              linkDirectionalParticleWidth={link => 1 * (link as Link).strength}
              linkDirectionalParticleColor={link => {
                const linkData = link as Link;
                if (linkData.creativeType && CREATIVE_SYNERGY_TYPES[linkData.creativeType]) {
                  return CREATIVE_SYNERGY_TYPES[linkData.creativeType].color;
                }
                return '#6b7280';
              }}
              linkCurvature={0.1}
              linkCanvasObjectMode={() => 'after'}
              linkCanvasObject={(link, ctx, globalScale) => {
                // Draw link descriptions as tooltips on links when zoomed in
                if (globalScale > 2) {
                  const linkData = link as Link;
                  const text = linkData.description;
                  const fontSize = 10 / globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  
                  // Calculate mid-point of the link
                  const start = link.source as any;
                  const end = link.target as any;
                  const midX = (start.x + end.x) / 2;
                  const midY = (start.y + end.y) / 2;
                  
                  // Check if this link represents a missing synergy
                  const isMissingSynergy = text.startsWith('MISSING:');
                  
                  if (isMissingSynergy) {
                    // Draw dashed line for missing synergies
                    const dash = [5, 5]; // dash and gap length
                    ctx.setLineDash(dash);
                    
                    // Draw the dashed line
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.strokeStyle = '#ef4444'; // red for missing
                    ctx.lineWidth = linkData.strength * 1.5; // Match the link width
                    ctx.stroke();
                    
                    // Reset line dash
                    ctx.setLineDash([]);
                    
                    // Draw missing synergy indicator
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'; // red-500
                    ctx.font = `bold ${fontSize}px Sans-Serif`;
                  } else {
                    // Draw text background for regular links
                    const bgColor = linkData.metaWeight && linkData.metaWeight > 0.8 ? 
                      'rgba(167, 243, 208, 0.8)' : 'rgba(255, 255, 255, 0.8)'; // light green for high meta, white for others
                    ctx.fillStyle = bgColor;
                    const textWidth = ctx.measureText(text).width;
                    ctx.fillRect(midX - textWidth/2 - 2, midY - fontSize/2 - 2, textWidth + 4, fontSize + 4);
                  }
                  
                  // Draw text
                  const textColor = isMissingSynergy ? 
                    'rgba(239, 68, 68, 0.9)' : // red for missing
                    'rgba(0, 0, 0, 0.8)'; // black for others
                  ctx.fillStyle = textColor;
                  ctx.fillText(text, midX, midY);
                }
              }}
              onNodeClick={(node) => {
                console.log('Clicked on node:', node);
              }}
              onNodeDragEnd={node => {
                node.fx = node.x;
                node.fy = node.y;
              }}
              cooldownTicks={100}
              onEngineStop={() => fgRef.current?.zoomToFit(400)}
              onLinkHover={(link) => {
                if (link) {
                  console.log('Hovering over link:', link);
                }
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Add cards to your deck to visualize synergies
            </div>
          )}
        </div>
      </div>
    </div>
  );
}