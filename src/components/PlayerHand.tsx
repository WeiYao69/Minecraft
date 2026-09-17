import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, PerspectiveCamera, CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
import { useWorldStore } from '../store';
import { grassTopTexture, dirtTexture, grassSideTexture, stoneTexture } from '../world/textures';

export function PlayerHand() {
  const groupRef = useRef<Group>(null);
  const { size, camera } = useThree();
  
  // Continuous swing progress tracking
  const swingProgressRef = useRef(0);
  const isSwingingRef = useRef(false);

  // Generate the custom skin texture matching the image
  const handTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 32; 
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base skin color (matches the lighter brown)
      ctx.fillStyle = '#9e6a4b';
      ctx.fillRect(0, 0, 16, 32);
      
      // Darker patches (matches the dark brown spots)
      ctx.fillStyle = '#734b33';
      
      // Left side top patch
      ctx.fillRect(1, 4, 4, 6);
      
      // Right side top patch
      ctx.fillRect(11, 7, 5, 4);
      
      // Middle patch
      ctx.fillRect(6, 12, 5, 7);
      
      // Left side bottom patch
      ctx.fillRect(2, 22, 5, 4);
      
      // Right side bottom patch
      ctx.fillRect(10, 19, 4, 13);
      
      // Imply fingers with vertical lines at the top (which maps to the hand tip)
      ctx.fillStyle = '#6b442a';
      ctx.fillRect(4, 0, 1, 5);
      ctx.fillRect(8, 0, 1, 5);
      ctx.fillRect(12, 0, 1, 5);
    }
    
    const tex = new CanvasTexture(canvas);
    tex.magFilter = NearestFilter;
    tex.minFilter = NearestFilter;
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, []);

  // Get selected item from hotbar
  const hotbar = useWorldStore((state) => state.hotbar);
  const selectedSlot = useWorldStore((state) => state.selectedHotbarSlot);
  const heldItem = hotbar[selectedSlot]?.type;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const isMining = useWorldStore.getState().isMining;
    const lastPlacedTime = useWorldStore.getState().lastPlacedTime;
    const timeSincePlace = performance.now() - lastPlacedTime;
    const isPlacingRecently = timeSincePlace < 180;
    
    // Base positioning
    const aspect = size.width / Math.max(size.height, 1);
    const pCam = camera as PerspectiveCamera;
    const fovRad = ((pCam.fov || 75) * Math.PI) / 360;
    
    const anchorZ = heldItem ? 0.6 : 0.25; 
    const halfHeightAtDepth = Math.tan(fovRad) * anchorZ;
    const halfWidthAtDepth = halfHeightAtDepth * aspect;
    
    // Position base near bottom-right edge of the screen
    const baseX = heldItem ? halfWidthAtDepth * 0.8 : halfWidthAtDepth * 0.95;
    const baseY = heldItem ? -halfHeightAtDepth * 1.0 : -halfHeightAtDepth * 1.1;
    const baseZ = -anchorZ;

    // 2. SWING ANIMATION CYCLE
    const shouldSwing = isMining || isPlacingRecently;
    
    if (shouldSwing) {
      isSwingingRef.current = true;
      swingProgressRef.current += delta * 6.0; // Faster, punchier swing
    } else {
      isSwingingRef.current = false;
      swingProgressRef.current = 0;
    }

    const p = swingProgressRef.current % 1;
    const swingArch = isSwingingRef.current ? Math.sin(p * Math.PI) : 0;

    // Swing rotations
    const swingRotX = swingArch * 0.60;
    const swingRotY = swingArch * 0.30;
    const swingRotZ = heldItem ? -swingArch * 0.20 : -swingArch * 0.10;
    
    // Swing translations (smaller for bare hand so it doesn't punch through the screen center)
    const swingOffsetX = heldItem ? -swingArch * 0.15 : -swingArch * 0.05;
    const swingOffsetY = heldItem ? -swingArch * 0.15 : -swingArch * 0.05;
    const swingOffsetZ = heldItem ? -swingArch * 0.25 : -swingArch * 0.1;

    // 4. APPLY TRANSFORMS
    groupRef.current.position.set(
      baseX + swingOffsetX,
      baseY + swingOffsetY,
      baseZ + swingOffsetZ
    );
    
    if (heldItem) {
      // Block holding pose - big and 3D
      groupRef.current.rotation.set(
        0.2 + swingRotX,
        -0.7 + swingRotY,
        0.15 + swingRotZ
      );
    } else {
      // Bare hand pose
      // Minecraft hand points largely forward and slightly inward
      groupRef.current.rotation.set(
        1.6 + swingRotX,  // Pitch forward
        0.4 + swingRotY,  // Yaw inward (left) - positive Y rotation moves -Z towards -X
        -0.1 + swingRotZ  // Roll
      );
    }
  });

  return (
    <group ref={groupRef}>
      {heldItem ? (
        <group position={[0, -0.05, 0]} scale={[0.7, 0.7, 0.7]}>
          <mesh renderOrder={999}>
            <boxGeometry args={[1, 1, 1]} />
            {heldItem === 'stone' && <meshStandardMaterial map={stoneTexture} depthTest={false} depthWrite={false} />}
            {heldItem === 'sand' && <meshStandardMaterial map={dirtTexture} color="#e3dbb0" depthTest={false} depthWrite={false} />}
            {heldItem === 'dirt' && <meshStandardMaterial map={dirtTexture} depthTest={false} depthWrite={false} />}
            {heldItem === 'bedrock' && <meshStandardMaterial map={stoneTexture} color="#333333" depthTest={false} depthWrite={false} />}
            {heldItem === 'grass' && (
              <>
                <meshStandardMaterial attach="material-0" map={grassSideTexture} depthTest={false} depthWrite={false} />
                <meshStandardMaterial attach="material-1" map={grassSideTexture} depthTest={false} depthWrite={false} />
                <meshStandardMaterial attach="material-2" map={grassTopTexture} color="#55aa55" depthTest={false} depthWrite={false} />
                <meshStandardMaterial attach="material-3" map={dirtTexture} depthTest={false} depthWrite={false} />
                <meshStandardMaterial attach="material-4" map={grassSideTexture} depthTest={false} depthWrite={false} />
                <meshStandardMaterial attach="material-5" map={grassSideTexture} depthTest={false} depthWrite={false} />
              </>
            )}
          </mesh>
        </group>
      ) : (
        <group position={[0, 0, 0]} renderOrder={999}>
          {/* Sleeve (bottom part of the arm, closer to camera) */}
          <mesh position={[0, 0.075, 0]}>
            <boxGeometry args={[0.155, 0.15, 0.155]} />
            <meshStandardMaterial color="#00a8aa" depthTest={false} depthWrite={false} />
          </mesh>
          {/* Skin / Forearm (extends outward) */}
          <mesh position={[0, 0.525, 0]}>
            <boxGeometry args={[0.15, 0.75, 0.15]} />
            <meshStandardMaterial map={handTexture} depthTest={false} depthWrite={false} roughness={1.0} />
          </mesh>
        </group>
      )}
    </group>
  );
}
