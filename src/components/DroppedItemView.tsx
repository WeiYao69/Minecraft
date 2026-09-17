import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DroppedItem, useWorldStore } from '../store';
import { grassTopTexture, dirtTexture, grassSideTexture, stoneTexture } from '../world/textures';

interface Props {
  item: DroppedItem;
}

export function DroppedItemView({ item }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const addInventory = useWorldStore(state => state.addInventory);
  const removeDroppedItem = useWorldStore(state => state.removeDroppedItem);
  const updateDroppedItem = useWorldStore(state => state.updateDroppedItem);
  const playerFeetPosition = useWorldStore(state => state.playerFeetPosition);
  
  // Track if we are currently absorbing into inventory
  const isAbsorbing = useRef(false);
  const currentY = useRef(item.position[1]);
  const velocityY = useRef(0);

  // Random offset so multiple drops don't perfectly overlap
  const bobOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    const time = performance.now() / 1000;
    
    // Rotate slowly
    meshRef.current.rotation.y += delta * 1.5;
    
    const itemPos = new THREE.Vector3().copy(meshRef.current.position);
    const targetPos = playerFeetPosition.clone().add(new THREE.Vector3(0, 1, 0));
    
    // Use targetPos (body center) for distance so items hovering don't get ignored
    const dist = itemPos.distanceTo(targetPos);
    
    // Pick up if close enough (within 1.5 blocks)
    if (dist < 1.5 && !isAbsorbing.current) {
      // Move towards player center (slightly above feet)
      meshRef.current.position.lerp(targetPos, delta * 8);
      
      if (dist < 0.5) {
        isAbsorbing.current = true;
        const remaining = addInventory(item.type, item.count);
        if (remaining === 0) {
          removeDroppedItem(item.id);
        } else if (remaining < item.count) {
          // Partially absorbed
          updateDroppedItem(item.id, remaining);
          isAbsorbing.current = false;
        } else {
          // Inventory full, couldn't absorb
          isAbsorbing.current = false;
        }
      }
    } else {
      // Physics (Falling)
      const blocks = useWorldStore.getState().blocks;
      let groundY = -50;
      const bx = Math.round(item.position[0]);
      const bz = Math.round(item.position[2]);
      
      for (const b of blocks) {
        if (b.x === bx && b.z === bz) {
          if (b.y <= currentY.current + 0.5 && b.y > groundY) {
            groundY = b.y;
          }
        }
      }
      
      // floorY is the top of the block beneath it
      const floorY = groundY + 0.5;
      
      if (currentY.current > floorY) {
        velocityY.current -= 15 * delta; // Gravity
        currentY.current += velocityY.current * delta;
        if (currentY.current < floorY) {
          currentY.current = floorY;
          velocityY.current = 0;
        }
      }

      // Bob gently up and down relative to its current physical Y
      meshRef.current.position.x = item.position[0];
      meshRef.current.position.z = item.position[2];
      meshRef.current.position.y = currentY.current + 0.2 + Math.sin(time * 3 + bobOffset) * 0.1;
    }
  });

  // Render tiny block
  const scale = 0.20; // Slightly smaller for more authentic look
  
  // Create an array of materials for blocks with different sides like grass
  const getMaterial = () => {
    if (item.type === 'stone') {
      return <meshStandardMaterial map={stoneTexture} />;
    }
    if (item.type === 'sand') {
      return <meshStandardMaterial map={dirtTexture} color="#e3dbb0" />;
    }
    if (item.type === 'dirt') {
      return <meshStandardMaterial map={dirtTexture} />;
    }
    if (item.type === 'bedrock') {
      return <meshStandardMaterial map={stoneTexture} color="#333333" />;
    }
    if (item.type === 'grass') {
      return (
        <>
          <meshStandardMaterial attach="material-0" map={grassSideTexture} />
          <meshStandardMaterial attach="material-1" map={grassSideTexture} />
          <meshStandardMaterial attach="material-2" map={grassTopTexture} color="#55aa55" />
          <meshStandardMaterial attach="material-3" map={dirtTexture} />
          <meshStandardMaterial attach="material-4" map={grassSideTexture} />
          <meshStandardMaterial attach="material-5" map={grassSideTexture} />
        </>
      );
    }
    return null;
  };

  return (
    <mesh ref={meshRef} position={item.position} scale={[scale, scale, scale]}>
      <boxGeometry args={[1, 1, 1]} />
      {getMaterial()}
    </mesh>
  );
}
