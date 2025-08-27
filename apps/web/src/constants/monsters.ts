// Monster-related constants for consistent use across components

export const MONSTER_EMOJI_MAP: Record<string, string[]> = {
  'slime': ['🟢', '🟡', '🟠'],
  'dragon': ['🐉', '🐲', '🔥'],
  'cat': ['🐱', '🐈', '🐈‍⬛'],
  'dog': ['🐕', '🐕‍🦺', '🦮']
};

export const MONSTER_NAME_MAP: Record<string, string> = {
  'slime': 'Slime',
  'dragon': 'Dragon',
  'cat': 'Cat',
  'dog': 'Dog',
};

export const XP_REQUIREMENTS = {
  1: 200,
  2: 500,
} as const;

// Helper functions
export const getMonsterEmoji = (species: string, stage: number = 1) => {
  return MONSTER_EMOJI_MAP[species]?.[stage - 1] || MONSTER_EMOJI_MAP[species]?.[0] || '🟢';
};

export const getMonsterName = (species: string) => {
  return MONSTER_NAME_MAP[species] || species;
};

export const getEvolutionMessage = (_species: string, stage: number) => {
  if (stage >= 3) {
    return 'Max Evolution';
  }
  
  return `Next evolution at ${XP_REQUIREMENTS[stage as keyof typeof XP_REQUIREMENTS]} XP`;
};
