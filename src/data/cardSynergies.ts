// Card synergy relationships - each card maps to other cards with their synergy type and strength
export const CARD_SYNERGIES: Record<string, Record<string, { type: string; strength: number; description: string }>> = {
  // Hog Cycle synergies
  'Hog Rider': {
    'Musketeer': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Musketeer provides ranged support for Hog pushes' 
    },
    'Ice Golem': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Ice Golem tanks damage and slows enemies for Hog' 
    },
    'Fireball': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Fireball clears enemy swarms blocking Hog path' 
    },
    'The Log': { 
      type: 'support', 
      strength: 0.9, 
      description: 'The Log provides instant bridge damage and protection' 
    },
    'Skeletons': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Skeletons provide additional chip damage on pushes' 
    },
    'Cannon': { 
      type: 'defense', 
      strength: 0.7, 
      description: 'Cannon defends against air attacks while Hog pushes' 
    },
    'Ice Spirit': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Ice Spirit helps control enemy positioning for Hog' 
    },
    'Knight': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Knight provides extra tank support for Hog pushes' 
    }
  },
  'Musketeer': {
    'Hog Rider': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Musketeer provides ranged damage support for Hog pushes' 
    },
    'Fireball': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Fireball clears swarms protecting Musketeer from damage' 
    },
    'The Log': { 
      type: 'support', 
      strength: 0.6, 
      description: 'The Log protects Musketeer from enemy retaliation' 
    },
    'Ice Golem': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Ice Golem tanks for Musketeer and synergizes with her damage' 
    },
    'Ice Spirit': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Ice Spirit helps control enemy positioning for Musketeer' 
    }
  },
  'Ice Golem': {
    'Hog Rider': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Ice Golem tanks for Hog and slows enemy defenders' 
    },
    'Musketeer': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Ice Golem protects Musketeer from close-range threats' 
    },
    'Fireball': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Fireball clears swarms threatening the Ice Golem tank' 
    },
    'The Log': { 
      type: 'support', 
      strength: 0.6, 
      description: 'The Log provides additional protection for Ice Golem' 
    },
    'Skeletons': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Skeletons provide additional chip damage after Ice Golem explodes' 
    },
    'Knight': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Knight provides additional tanking support for the combo' 
    }
  },
  'Fireball': {
    'Hog Rider': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Fireball clears defensive swarms blocking Hog path' 
    },
    'Musketeer': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Fireball protects Musketeer from swarm units' 
    },
    'Ice Golem': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Fireball clears swarms targeting the Ice Golem' 
    },
    'The Log': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Fireball and The Log combo clears key defensive units' 
    },
    'Cannon': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Fireball protects Cannon from swarm attacks' 
    },
    'Ice Spirit': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Fireball enhances the damage potential of Ice Spirit' 
    }
  },
  'The Log': {
    'Hog Rider': { 
      type: 'support', 
      strength: 0.9, 
      description: 'The Log provides instant bridge damage and protection for Hog' 
    },
    'Musketeer': { 
      type: 'support', 
      strength: 0.6, 
      description: 'The Log protects Musketeer from retaliation' 
    },
    'Ice Golem': { 
      type: 'support', 
      strength: 0.6, 
      description: 'The Log protects Ice Golem while it tanks' 
    },
    'Fireball': { 
      type: 'support', 
      strength: 0.7, 
      description: 'The Log and Fireball combo efficiently removes defensive units' 
    },
    'Skeletons': { 
      type: 'support', 
      strength: 0.5, 
      description: 'The Log supports Skeletons with slow effect' 
    },
    'Cannon': { 
      type: 'defense', 
      strength: 0.6, 
      description: 'The Log protects Cannon from direct attacks' 
    },
    'Knight': { 
      type: 'support', 
      strength: 0.5, 
      description: 'The Log provides protection for Knight' 
    }
  },

  // Golem synergies
  'Golem': {
    'Night Witch': { 
      type: 'support', 
      strength: 0.9, 
      description: 'Night Witch provides flying support while Golem tanks' 
    },
    'Baby Dragon': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Baby Dragon provides aerial defense for Golem' 
    },
    'Mega Minion': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Mega Minion provides air support for Golem pushes' 
    },
    'Lumberjack': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Lumberjack becomes a tank when Golem dies' 
    },
    'Lightning': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Lightning removes key defensive structures for Golem' 
    },
    'Tornado': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Tornado groups enemy units for Golem to damage' 
    },
    'Elixir Collector': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Collector generates elixir for expensive Golem' 
    }
  },
  'Night Witch': {
    'Golem': { 
      type: 'support', 
      strength: 0.9, 
      description: 'Golem provides tanking while Night Witch spawns bats' 
    },
    'Baby Dragon': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Baby Dragon covers Night Witch from air attacks' 
    },
    'Mega Minion': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Mega Minion provides additional air support' 
    },
    'Lumberjack': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Lumberjack supports the flying unit combination' 
    },
    'Elixir Collector': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Collector supports the high-elixir unit combination' 
    }
  },
  'Baby Dragon': {
    'Golem': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Baby Dragon provides air defense for Golem' 
    },
    'Night Witch': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Baby Dragon and Night Witch synergize for air control' 
    },
    'Mega Minion': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Both provide air support for deck' 
    },
    'Lumberjack': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Lumberjack complements Baby Dragon as flying support' 
    },
    'Lightning': { 
      type: 'defense', 
      strength: 0.5, 
      description: 'Lightning protects flying units from defenses' 
    },
    'Tornado': { 
      type: 'defense', 
      strength: 0.5, 
      description: 'Tornado helps flying units target grouped enemies' 
    }
  },

  // X-Bow synergies
  'X-Bow': {
    'Tesla': { 
      type: 'defense', 
      strength: 0.8, 
      description: 'Tesla protects X-Bow from ground attacks' 
    },
    'Archers': { 
      type: 'defense', 
      strength: 0.7, 
      description: 'Archers provide additional defense for X-Bow' 
    },
    'Skeletons': { 
      type: 'defense', 
      strength: 0.6, 
      description: 'Skeletons tank for X-Bow and provide chip damage' 
    },
    'Ice Golem': { 
      type: 'defense', 
      strength: 0.6, 
      description: 'Ice Golem tanks for X-Bow and slows attackers' 
    },
    'The Log': { 
      type: 'support', 
      strength: 0.7, 
      description: 'The Log protects X-Bow from hasty units' 
    },
    'Fireball': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Fireball clears swarm units threatening X-Bow' 
    },
    'Knight': { 
      type: 'defense', 
      strength: 0.5, 
      description: 'Knight provides tank defense for X-Bow' 
    }
  },

  // Spell Bait synergies
  'Goblin Barrel': {
    'Princess': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Princess provides long-range bait support' 
    },
    'Inferno Tower': { 
      type: 'defense', 
      strength: 0.9, 
      description: 'Inferno Tower defends against high-health threats' 
    },
    'Knight': { 
      type: 'defense', 
      strength: 0.6, 
      description: 'Knight provides tank defense for spell bait combo' 
    },
    'The Log': { 
      type: 'defense', 
      strength: 0.6, 
      description: 'The Log provides quick defense for spell bait' 
    },
    'Rocket': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Rocket provides high-damage punishment for baited troops' 
    },
    'Ice Spirit': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Ice Spirit slows enemies for bait effect' 
    },
    'Goblin Gang': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Goblin Gang provides additional bait units' 
    }
  },

  // Lavaloon synergies
  'Lava Hound': {
    'Balloon': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Balloon provides additional air damage after Lava Hound dies' 
    },
    'Mega Minion': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Mega Minion provides air support and protection' 
    },
    'Inferno Dragon': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Inferno Dragon provides targeted air defense' 
    },
    'Arrows': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Arrows clear swarm units threatening Lava Hound' 
    },
    'Zap': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Zap stuns enemies and protects Lava Hound' 
    },
    'Tombstone': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Tombstone provides additional support units' 
    },
    'Minions': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Minions provide additional air damage' 
    }
  },
  'Balloon': {
    'Lava Hound': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Lava Hound tanks for Balloon and dies to provide damage' 
    },
    'Mega Minion': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Mega Minion provides protection and support' 
    },
    'Inferno Dragon': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Inferno Dragon protects Balloon from other air units' 
    },
    'Minions': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Minions provide additional air damage' 
    }
  },
  'Mega Minion': {
    'Lava Hound': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Mega Minion provides air defense for Lava Hound' 
    },
    'Balloon': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Mega Minion supports Balloon with additional damage' 
    },
    'Inferno Dragon': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Both provide air unit support' 
    },
    'Minions': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Both provide air damage support' 
    }
  },

  // General defensive synergies
  'Tombstone': {
    'Skeletons': { 
      type: 'support', 
      strength: 0.8, 
      description: 'Skeletons provide both offensive and defensive potential' 
    },
    'Musketeer': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Musketeer provides ranged defense while Tombstone spawns' 
    },
    'Arrows': { 
      type: 'defense', 
      strength: 0.5, 
      description: 'Arrows protect Tombstone from swarm units' 
    },
    'Fireball': { 
      type: 'defense', 
      strength: 0.6, 
      description: 'Fireball protects Tombstone from threats' 
    },
    'The Log': { 
      type: 'defense', 
      strength: 0.5, 
      description: 'The Log provides protection for Tombstone' 
    },
    'Goblin Gang': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Goblin Gang provides additional defensive units' 
    }
  },
  'Cannon': {
    'Hog Rider': { 
      type: 'defense', 
      strength: 0.8, 
      description: 'Cannon defends while Hog Rider pushes on other lane' 
    },
    'Musketeer': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Musketeer provides additional ranged defense' 
    },
    'Fireball': { 
      type: 'defense', 
      strength: 0.5, 
      description: 'Fireball protects Cannon from swarm attacks' 
    },
    'The Log': { 
      type: 'defense', 
      strength: 0.6, 
      description: 'The Log provides protection for Cannon' 
    },
    'Skeletons': { 
      type: 'defense', 
      strength: 0.5, 
      description: 'Skeletons provide additional defensive presence' 
    }
  },
  
  // Cycle cards synergies
  'Skeletons': {
    'Fireball': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Fireball can clear skeletons for damage' 
    },
    'The Log': { 
      type: 'support', 
      strength: 0.6, 
      description: 'The Log and skeletons provide efficient elixir use' 
    },
    'Ice Spirit': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Both provide cheap elixir cycling options' 
    },
    'Knight': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Knight and skeletons provide balanced ground defense' 
    }
  },
  'Ice Spirit': {
    'Skeletons': { 
      type: 'support', 
      strength: 0.7, 
      description: 'Both provide cheap elixir cycling options' 
    },
    'Fireball': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Fireball synergizes with Ice Spirit for damage' 
    },
    'The Log': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Both provide efficient elixir usage' 
    },
    'Hog Rider': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Ice Spirit helps control enemy positioning before Hog push' 
    }
  },
  'Knight': {
    'Hog Rider': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Knight provides additional tank support' 
    },
    'Musketeer': { 
      type: 'support', 
      strength: 0.6, 
      description: 'Knight and Musketeer provide balanced ground army' 
    },
    'Ice Golem': { 
      type: 'support', 
      strength: 0.5, 
      description: 'Knight supports Ice Golem with additional tanking' 
    },
    'Cannon': { 
      type: 'defense', 
      strength: 0.6, 
      description: 'Knight provides ground defense for Cannon' 
    }
  }
};

// Synergy type colors for visualization
export const SYNERGY_COLORS: Record<string, string> = {
  support: '#4ade80',   // green-400
  defense: '#60a5fa',   // blue-400
  offense: '#f87171',   // red-400
  cycle: '#a78bfa',     // violet-400
  bait: '#fbbf24',      // amber-400
  tank: '#38bdf8'       // sky-400
};

// Synergy type descriptions
export const SYNERGY_DESCRIPTIONS: Record<string, string> = {
  support: 'Cards that work together offensively or defensively',
  defense: 'Cards that protect or defend other cards',
  offense: 'Cards that work together for attacking',
  cycle: 'Cards that help with elixir management',
  bait: 'Cards used to trick opponent into using spells',
  tank: 'Cards that tank damage for other units'
};

// Potential synergies - cards that would create strong synergies with common deck archetypes
export const POTENTIAL_SYNERGIES: Record<string, { archetype: string; cardSuggestions: string[] }> = {
  'Hog Rider': { 
    archetype: 'Hog Cycle', 
    cardSuggestions: ['Musketeer', 'Ice Golem', 'Fireball', 'The Log', 'Skeletons', 'Cannon'] 
  },
  'Golem': { 
    archetype: 'Golem', 
    cardSuggestions: ['Night Witch', 'Baby Dragon', 'Mega Minion', 'Lumberjack', 'Lightning', 'Tornado', 'Elixir Collector'] 
  },
  'X-Bow': { 
    archetype: 'Siege', 
    cardSuggestions: ['Tesla', 'Archers', 'Skeletons', 'Ice Golem', 'The Log', 'Fireball', 'Knight'] 
  },
  'Lava Hound': { 
    archetype: 'Lavaloon', 
    cardSuggestions: ['Balloon', 'Mega Minion', 'Inferno Dragon', 'Arrows', 'Zap', 'Tombstone', 'Minions'] 
  },
  'Goblin Barrel': { 
    archetype: 'Spell Bait', 
    cardSuggestions: ['Princess', 'Inferno Tower', 'Knight', 'The Log', 'Rocket', 'Ice Spirit', 'Goblin Gang'] 
  }
};