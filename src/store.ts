import { create } from 'zustand';
import { Block, WORLD_BLOCKS, BlockType } from './world/blocks';

import { Vector3 } from 'three';

export interface DroppedItem {
  id: string;
  type: BlockType;
  position: [number, number, number];
  count: number;
}

export interface HotbarSlot {
  type: BlockType | null;
  count: number;
}

export interface FallingBlock {
  id: string;
  type: BlockType;
  position: [number, number, number];
  velocity: number;
}

interface WorldState {
  blocks: Block[];
  fallingBlocks: FallingBlock[];
  setBlocks: (blocks: Block[]) => void;
  setFallingBlocks: (fallingBlocks: FallingBlock[]) => void;
  removeBlock: (x: number, y: number, z: number) => void;
  addBlock: (x: number, y: number, z: number, type: BlockType) => void;
  isMining: boolean;
  setIsMining: (isMining: boolean) => void;
  
  hotbar: HotbarSlot[];
  selectedHotbarSlot: number;
  setSelectedHotbarSlot: (slot: number) => void;
  addInventory: (type: BlockType, count: number) => number;
  removeInventory: (slot: number, count: number) => void;
  
  droppedItems: DroppedItem[];
  addDroppedItem: (type: BlockType, position: [number, number, number], count: number) => void;
  removeDroppedItem: (id: string) => void;
  updateDroppedItem: (id: string, count: number) => void;
  
  // Placed block animation tracker
  lastPlacedTime: number;
  
  // Track player physics state for intersection tests outside the player component
  playerFeetPosition: Vector3;
  setPlayerFeetPosition: (pos: Vector3) => void;
  playerHeight: number;
  setPlayerHeight: (height: number) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  blocks: WORLD_BLOCKS,
  fallingBlocks: [],
  setBlocks: (blocks) => set({ blocks }),
  setFallingBlocks: (fallingBlocks) => set({ fallingBlocks }),
  removeBlock: (x, y, z) => set((state) => ({
    blocks: state.blocks.filter(b => !(b.x === x && b.y === y && b.z === z))
  })),
  addBlock: (x, y, z, type) => set((state) => {
    // Prevent duplicate blocks at the same coordinate
    if (state.blocks.some(b => b.x === x && b.y === y && b.z === z)) {
      return state;
    }
    return { blocks: [...state.blocks, { x, y, z, type, createdAt: performance.now() }] };
  }),
  isMining: false,
  setIsMining: (isMining) => set({ isMining }),
  
  hotbar: [
    { type: 'grass', count: 64 },
    { type: 'stone', count: 64 },
    { type: 'dirt', count: 64 },
    { type: null, count: 0 },
    { type: null, count: 0 },
    { type: null, count: 0 },
    { type: null, count: 0 },
    { type: null, count: 0 },
    { type: null, count: 0 },
  ],
  selectedHotbarSlot: 0,
  setSelectedHotbarSlot: (slot) => set({ selectedHotbarSlot: slot }),
  
  addInventory: (type, count) => {
    let remaining = count;
    set((state) => {
      const newHotbar = [...state.hotbar];
      
      // First try to add to an existing stack
      for (let i = 0; i < newHotbar.length; i++) {
        if (newHotbar[i].type === type && newHotbar[i].count < 64) {
          const space = 64 - newHotbar[i].count;
          const addAmount = Math.min(space, remaining);
          newHotbar[i] = { ...newHotbar[i], count: newHotbar[i].count + addAmount };
          remaining -= addAmount;
          if (remaining <= 0) return { hotbar: newHotbar };
        }
      }
      
      // Then try empty slots
      for (let i = 0; i < newHotbar.length; i++) {
        if (newHotbar[i].type === null) {
          const addAmount = Math.min(64, remaining);
          newHotbar[i] = { type, count: addAmount };
          remaining -= addAmount;
          if (remaining <= 0) return { hotbar: newHotbar };
        }
      }
      
      return { hotbar: newHotbar };
    });
    return remaining;
  },
  
  removeInventory: (slot, count) => set((state) => {
    const newHotbar = [...state.hotbar];
    if (newHotbar[slot] && newHotbar[slot].count >= count) {
      newHotbar[slot] = { 
        ...newHotbar[slot], 
        count: newHotbar[slot].count - count,
        type: newHotbar[slot].count - count === 0 ? null : newHotbar[slot].type 
      };
      return { hotbar: newHotbar, lastPlacedTime: performance.now() };
    }
    return state;
  }),
  
  droppedItems: [],
  addDroppedItem: (type, position, count) => set((state) => ({
    droppedItems: [...state.droppedItems, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position,
      count,
    }]
  })),
  removeDroppedItem: (id) => set((state) => ({
    droppedItems: state.droppedItems.filter(item => item.id !== id)
  })),
  updateDroppedItem: (id, count) => set((state) => ({
    droppedItems: state.droppedItems.map(item => item.id === id ? { ...item, count } : item)
  })),
  
  lastPlacedTime: 0,
  
  playerFeetPosition: new Vector3(0, 5, 0),
  setPlayerFeetPosition: (pos) => set({ playerFeetPosition: pos }),
  playerHeight: 1.8,
  setPlayerHeight: (height) => set({ playerHeight: height }),
}));
