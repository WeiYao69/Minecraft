const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerHand.tsx', 'utf8');

const s1 = `    // Base positioning
    const aspect = size.width / Math.max(size.height, 1);
    const pCam = camera as PerspectiveCamera;
    const fovRad = ((pCam.fov || 75) * Math.PI) / 360;
    
    // Calculate screen bounds at a deeper Z to reduce extreme perspective distortion
    const anchorZ = heldItem ? 0.6 : 0.4; 
    const halfHeightAtDepth = Math.tan(fovRad) * anchorZ;
    const halfWidthAtDepth = halfHeightAtDepth * aspect;
    
    // Position base near bottom-right edge of the screen
    // Move it lower for the bare hand to hide the stump
    const baseX = Math.max(0.2, Math.min(0.6, halfWidthAtDepth * (heldItem ? 0.8 : 1.1)));
    const baseY = -Math.max(0.2, Math.min(0.6, halfHeightAtDepth * (heldItem ? 1.0 : 1.0)));
    const baseZ = -anchorZ;`;

const r1 = `    // Base positioning
    const aspect = size.width / Math.max(size.height, 1);
    const pCam = camera as PerspectiveCamera;
    const fovRad = ((pCam.fov || 75) * Math.PI) / 360;
    
    const anchorZ = heldItem ? 0.6 : 0.25; 
    const halfHeightAtDepth = Math.tan(fovRad) * anchorZ;
    const halfWidthAtDepth = halfHeightAtDepth * aspect;
    
    // Position base near bottom-right edge of the screen
    const baseX = heldItem ? halfWidthAtDepth * 0.8 : halfWidthAtDepth * 0.95;
    const baseY = heldItem ? -halfHeightAtDepth * 1.0 : -halfHeightAtDepth * 1.1;
    const baseZ = -anchorZ;`;

const s2 = `    const p = swingProgressRef.current % 1;
    const swingArch = isSwingingRef.current ? Math.sin(p * Math.PI) : 0;

    // Swing rotations
    const swingRotX = swingArch * 0.60;  // Pitch downward
    const swingRotY = swingArch * 0.30;  // Yaw inward (left)
    const swingRotZ = -swingArch * 0.20; // Roll
    
    // Swing translations
    const swingOffsetX = -swingArch * 0.15; // Towards screen center
    const swingOffsetY = -swingArch * 0.15; // Dips downward
    const swingOffsetZ = -swingArch * 0.25; // Punches DEEP into the screen`;

const r2 = `    const p = swingProgressRef.current % 1;
    const swingArch = isSwingingRef.current ? Math.sin(p * Math.PI) : 0;

    // Swing rotations
    const swingRotX = swingArch * 0.60;
    const swingRotY = swingArch * 0.30;
    const swingRotZ = heldItem ? -swingArch * 0.20 : -swingArch * 0.10;
    
    // Swing translations (smaller for bare hand so it doesn't punch through the screen center)
    const swingOffsetX = heldItem ? -swingArch * 0.15 : -swingArch * 0.05;
    const swingOffsetY = heldItem ? -swingArch * 0.15 : -swingArch * 0.05;
    const swingOffsetZ = heldItem ? -swingArch * 0.25 : -swingArch * 0.1;`;

const s3 = `    } else {
      // Bare hand pose
      groupRef.current.rotation.set(
        1.4 + swingRotX,
        -0.2 + swingRotY,
        0.2 + swingRotZ
      );
    }`;

const r3 = `    } else {
      // Bare hand pose
      // Minecraft hand points largely forward and slightly inward
      groupRef.current.rotation.set(
        1.6 + swingRotX,  // Pitch forward
        -0.4 + swingRotY, // Yaw inward (left)
        -0.1 + swingRotZ  // Roll
      );
    }`;

const s4 = `      ) : (
        <group position={[0, -0.6, 0]} renderOrder={999}>
          {/* Sleeve */}
          <mesh position={[0, -1.0, 0]}>
            <boxGeometry args={[0.28, 2.0, 0.28]} />
            <meshStandardMaterial 
              color="#00a8aa" 
              depthTest={false} 
              depthWrite={false} 
            />
          </mesh>
          {/* Skin / Forearm */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.25, 1.4, 0.25]} />
            <meshStandardMaterial 
              map={handTexture}
              depthTest={false} 
              depthWrite={false} 
              roughness={1.0} 
            />
          </mesh>
        </group>
      )}`;

const r4 = `      ) : (
        <group position={[0, 0, 0]} renderOrder={999}>
          {/* Sleeve (bottom part of the arm, closer to camera) */}
          <mesh position={[0, 0.075, 0]}>
            <boxGeometry args={[0.155, 0.15, 0.155]} />
            <meshStandardMaterial color="#00a8aa" depthTest={false} depthWrite={false} />
          </mesh>
          {/* Skin / Forearm (extends outward) */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.15, 0.3, 0.15]} />
            <meshStandardMaterial map={handTexture} depthTest={false} depthWrite={false} roughness={1.0} />
          </mesh>
        </group>
      )}`;

code = code.replace(s1, r1);
code = code.replace(s2, r2);
code = code.replace(s3, r3);
code = code.replace(s4, r4);
fs.writeFileSync('src/components/PlayerHand.tsx', code);
