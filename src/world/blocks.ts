export type BlockType = 'grass' | 'stone' | 'dirt' | 'sand' | 'bedrock';

export interface Block {
  x: number;
  y: number;
  z: number;
  type: BlockType;
  createdAt?: number;
}

export interface BlockProperties {
  breakTime: number;
  canBreakByHand: boolean;
  requiresTool: boolean;
  requiredToolType: string | null;
  drops: BlockType | null;
  dropCount: number;
  
}

export const BLOCK_PROPERTIES: Record<BlockType, BlockProperties> = {
  grass: {
    breakTime: 0.75,
    canBreakByHand: true,
    requiresTool: false,
    requiredToolType: null,
    drops: 'dirt',
    dropCount: 1,
    
  },
  dirt: {
    breakTime: 0.75,
    canBreakByHand: true,
    requiresTool: false,
    requiredToolType: null,
    drops: 'dirt',
    dropCount: 1,
    
  },
  stone: {
    breakTime: 7.5,
    canBreakByHand: true,
    requiresTool: true,
    requiredToolType: 'pickaxe',
    drops: 'stone',
    dropCount: 1,
    
  },
  bedrock: {
    breakTime: Infinity,
    canBreakByHand: false,
    requiresTool: false,
    requiredToolType: null,
    drops: null,
    dropCount: 0,
  },
  sand: {
    breakTime: 0.75,
    canBreakByHand: true,
    requiresTool: false,
    requiredToolType: null,
    drops: 'sand',
    dropCount: 1,
    
  },
};

// Generate a simple 5x5 platform
export const WORLD_BLOCKS: Block[] = [];

// Base platform
for (let x = -2; x <= 2; x++) {
  for (let z = -2; z <= 2; z++) {
    // Mostly grass, some stone
    const isStone = (x % 2 !== 0) && (z % 2 !== 0);
    WORLD_BLOCKS.push({ x, y: 0, z, type: isStone ? 'stone' : 'grass' });
  }
}

// Add a single elevated stone block in the center to test jumping
WORLD_BLOCKS.push({ x: 0, y: 1, z: 0, type: 'stone' });
