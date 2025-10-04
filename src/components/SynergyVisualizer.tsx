'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Card } from '../types';
import { CARD_SYNERGIES, SYNERGY_COLORS, SYNERGY_DESCRIPTIONS, POTENTIAL_SYNERGIES } from '../data/cardSynergies';

// Dynamic import for the ForceGraph2D component to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => <div>Loading graph...</div>
});

import dynamic from 'next/dynamic';

interface SynergyVisualizerProps {
  deck: Card[];
  cards: Card[];
  highlightedCards: string[];
}

interface Node {
  id: string;
  name: string;
  type: 'deck' | 'available' | 'highlighted' | 'suggestion';
  elixirCost: number;
  img: string;
}

interface Link {
  source: string;
  target: string;
  type: string; // 'support', 'defense', 'offense', etc.
  strength: number; // 0-1 scale
  description: string;
  isSuggestion?: boolean; // Whether this link represents a suggested synergy
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
    // Create nodes for deck cards
    const deckNodes: Node[] = deck.map(card => ({
      id: card.id,
      name: card.name,
      type: highlightedCards.includes(card.name) ? 'highlighted' : 'deck',
      elixirCost: card.elixirCost,
      img: card.iconUrls.medium
    }));

    // Create links based on synergies between deck cards
    const deckLinks: Link[] = [];
    const processedPairs = new Set<string>();

    deck.forEach(card1 => {
      deck.forEach(card2 => {
        if (card1.id !== card2.id) {
          const pairKey = [card1.id, card2.id].sort().join('-');
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);

            // Check if there's a synergy between these cards
            const synergy = CARD_SYNERGIES[card1.name]?.[card2.name];
            if (synergy) {
              deckLinks.push({
                source: card1.id,
                target: card2.id,
                type: synergy.type,
                strength: synergy.strength,
                description: synergy.description
              });
            }
          }
        }
      });
    });

    // Create nodes and links for available cards that have synergies with deck cards
    const availableNodes: Node[] = [];
    const availableLinks: Link[] = [];

    deck.forEach(deckCard => {
      cards.forEach(availableCard => {
        // Don't add available cards if they're already in the deck
        if (!deck.some(c => c.id === availableCard.id)) {
          // Check if available card has synergy with deck card
          const synergy1 = CARD_SYNERGIES[deckCard.name]?.[availableCard.name];
          if (synergy1) {
            // Add the available card to nodes if not already present
            if (!availableNodes.some(n => n.id === availableCard.id)) {
              availableNodes.push({
                id: availableCard.id,
                name: availableCard.name,
                type: 'available',
                elixirCost: availableCard.elixirCost,
                img: availableCard.iconUrls.medium
              });
            }

            // Add the link
            availableLinks.push({
              source: deckCard.id,
              target: availableCard.id,
              type: synergy1.type,
              strength: synergy1.strength,
              description: synergy1.description
            });
          }

          // Also check the reverse direction (available card to deck card)
          const synergy2 = CARD_SYNERGIES[availableCard.name]?.[deckCard.name];
          if (synergy2 && !availableLinks.some(link => 
            (link.source === availableCard.id && link.target === deckCard.id) ||
            (link.source === deckCard.id && link.target === availableCard.id)
          )) {
            // Make sure the available card is in the nodes list
            if (!availableNodes.some(n => n.id === availableCard.id)) {
              availableNodes.push({
                id: availableCard.id,
                name: availableCard.name,
                type: 'available',
                elixirCost: availableCard.elixirCost,
                img: availableCard.iconUrls.medium
              });
            }

            // Add the link
            availableLinks.push({
              source: deckCard.id,
              target: availableCard.id,
              type: synergy2.type,
              strength: synergy2.strength,
              description: synergy2.description
            });
          }
        }
      });
    });

    // Identify missing synergies and suggest additional cards
    const suggestionNodes: Node[] = [];
    const suggestionLinks: Link[] = [];
    
    // Find cards that could complete archetypes in the current deck
    deck.forEach(deckCard => {
      const potentialMatches = POTENTIAL_SYNERGIES[deckCard.name];
      if (potentialMatches) {
        potentialMatches.cardSuggestions.forEach(suggestedCardName => {
          // Only consider cards not already in the deck
          const suggestedCard = cards.find(c => c.name === suggestedCardName && !deck.some(d => d.name === suggestedCardName));
          if (suggestedCard && !suggestionNodes.some(n => n.id === suggestedCard.id)) {
            // Create a suggestion node
            suggestionNodes.push({
              id: `suggestion-${suggestedCard.id}`,
              name: suggestedCard.name,
              type: 'suggestion',
              elixirCost: suggestedCard.elixirCost,
              img: suggestedCard.iconUrls.medium
            });

            // Find if there's a synergy between the deck card and suggested card
            const synergy = CARD_SYNERGIES[deckCard.name]?.[suggestedCard.name] || 
                           CARD_SYNERGIES[suggestedCard.name]?.[deckCard.name];
            
            if (synergy) {
              suggestionLinks.push({
                source: deckCard.id,
                target: `suggestion-${suggestedCard.id}`,
                type: synergy.type,
                strength: Math.min(synergy.strength * 0.8, 0.8), // Slightly weaker to distinguish from existing synergies
                description: `Suggested: ${synergy.description}`,
                isSuggestion: true
              });
            }
          }
        });
      }
    });

    // Combine all nodes and links
    const allNodes = [...deckNodes, ...availableNodes, ...suggestionNodes];
    const allLinks = [...deckLinks, ...availableLinks, ...suggestionLinks];

    setNodes(allNodes);
    setLinks(allLinks);

    // Auto-center and zoom to fit
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400);
      }
    }, 100);
  }, [deck, cards, highlightedCards]);

  // Color mapping for nodes
  const getNodeColor = (node: Node) => {
    switch (node.type) {
      case 'deck':
        return '#3b82f6'; // blue-500
      case 'highlighted':
        return '#f59e0b'; // amber-500
      case 'available':
        return '#9ca3af'; // gray-400
      case 'suggestion':
        return '#ec4899'; // pink-500
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
        <h2 className="text-2xl font-semibold text-gray-900">Card Synergy Visualizer</h2>
        <p className="text-sm text-gray-500 mt-1">
          Shows synergies between your deck cards and available cards
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
              <span className="text-xs">Highlighted</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
              <span className="text-xs">Available Cards</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-pink-500 mr-1" style={{ transform: 'rotate(45deg)' }}></div>
              <span className="text-xs">Suggestions</span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            {Object.entries(SYNERGY_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center">
                <div className="w-3 h-0.5" style={{ backgroundColor: color, marginRight: '4px' }}></div>
                <span className="text-xs capitalize">{type}</span>
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
                  
                  // Draw different label for suggestions
                  if (node.type === 'suggestion') {
                    ctx.fillStyle = 'rgba(236, 72, 153, 0.8)'; // pink-500
                    ctx.font = `bold ${fontSize}px Sans-Serif`;
                  }
                  
                  ctx.fillText(label, node.x!, node.y! + size/2 + 1);
                } else {
                  // Fallback circle
                  const size = getNodeSize(node as Node);
                  ctx.beginPath();
                  ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI, false);
                  ctx.fillStyle = getNodeColor(node as Node);
                  ctx.fill();
                  
                  // Draw label if no image
                  const label = (node as any).name || '';
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                  ctx.fillText(label, node.x!, node.y! + size + 10);
                }
              }}
              linkColor={link => {
                // Use dashed lines for suggested links
                if ((link as Link).isSuggestion) {
                  return '#ec4899'; // pink-500 for suggestions
                }
                return SYNERGY_COLORS[(link as Link).type] || '#9ca3af';
              }}
              linkWidth={link => {
                const baseStrength = (link as Link).strength;
                return (link as Link).isSuggestion ? baseStrength * 1.5 : baseStrength * 2; // Slightly thicker for suggestions
              }}
              linkDirectionalArrowLength={link => (link as Link).isSuggestion ? 2 : 3}
              linkDirectionalArrowRelPos={0.5}
              linkDirectionalParticles={link => (link as Link).isSuggestion ? 0 : (link as Link).strength * 2} // No particles for suggestions
              linkDirectionalParticleWidth={link => 1 * (link as Link).strength}
              linkDirectionalParticleColor={link => SYNERGY_COLORS[(link as Link).type] || '#9ca3af'}
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
                  
                  // Draw different styling for suggestion links
                  if (linkData.isSuggestion) {
                    // Draw dashed line for suggestions
                    const dash = [5, 5]; // dash and gap length
                    ctx.setLineDash(dash);
                    
                    // Draw the dashed line
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.strokeStyle = '#ec4899';
                    ctx.lineWidth = linkData.strength * 1.5; // Match the link width
                    ctx.stroke();
                    
                    // Reset line dash
                    ctx.setLineDash([]);
                    
                    // Draw suggestion indicator
                    ctx.fillStyle = 'rgba(236, 72, 153, 0.9)'; // pink-500
                    ctx.font = `bold ${fontSize}px Sans-Serif`;
                  } else {
                    // Draw text background for regular links
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    const textWidth = ctx.measureText(text).width;
                    ctx.fillRect(midX - textWidth/2 - 2, midY - fontSize/2 - 2, textWidth + 4, fontSize + 4);
                  }
                  
                  // Draw text
                  ctx.fillStyle = linkData.isSuggestion ? 'rgba(236, 72, 153, 0.9)' : 'rgba(0, 0, 0, 0.8)';
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