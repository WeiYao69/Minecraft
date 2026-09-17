const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerHand.tsx', 'utf8');

const s1 = `    // Move it lower for the bare hand to hide the stump
    const baseX = Math.max(0.2, Math.min(0.6, halfWidthAtDepth * (heldItem ? 0.8 : 0.95)));
    const baseY = -Math.max(0.2, Math.min(0.6, halfHeightAtDepth * (heldItem ? 1.0 : 1.4)));`;
const r1 = `    // Move it lower for the bare hand to hide the stump
    const baseX = Math.max(0.2, Math.min(0.6, halfWidthAtDepth * (heldItem ? 0.8 : 0.85)));
    const baseY = -Math.max(0.2, Math.min(0.6, halfHeightAtDepth * (heldItem ? 1.0 : 1.2)));`;

const s2 = `      // Bare hand pose
      groupRef.current.rotation.set(
        1.3 + swingRotX,
        0.15 + swingRotY,
        0.1 + swingRotZ
      );`;
const r2 = `      // Bare hand pose
      groupRef.current.rotation.set(
        1.4 + swingRotX,
        -0.3 + swingRotY,
        0.1 + swingRotZ
      );`;

const s3 = `      ) : (
        <group position={[0, -0.7, 0]} renderOrder={999}>
          {/* Sleeve */}
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[0.28, 1.2, 0.28]} />
            <meshStandardMaterial 
              color="#00a8aa" 
              depthTest={false} 
              depthWrite={false} 
            />
          </mesh>
          {/* Skin */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.26, 1.0, 0.26]} />
            <meshStandardMaterial 
              map={handTexture}
              depthTest={false} 
              depthWrite={false} 
              roughness={1.0} 
            />
          </mesh>
        </group>
      )}`;
const r3 = `      ) : (
        <group position={[0, -0.6, 0]} renderOrder={999}>
          {/* Sleeve */}
          <mesh position={[0, -1.0, 0]}>
            <boxGeometry args={[0.28, 2.4, 0.28]} />
            <meshStandardMaterial color="#00a8aa" depthTest={false} depthWrite={false} />
          </mesh>
          {/* Forearm & Hand */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.25, 1.6, 0.25]} />
            <meshStandardMaterial map={handTexture} depthTest={false} depthWrite={false} roughness={1.0} />
          </mesh>
        </group>
      )}`;

code = code.replace(s1, r1);
code = code.replace(s2, r2);
code = code.replace(s3, r3);
fs.writeFileSync('src/components/PlayerHand.tsx', code);
