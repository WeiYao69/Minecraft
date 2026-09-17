const fs = require('fs');
let code = fs.readFileSync('src/components/DroppedItemView.tsx', 'utf8');

const s1 = `  // Track if we are currently absorbing into inventory
  const isAbsorbing = useRef(false);`;

const r1 = `  // Track if we are currently absorbing into inventory
  const isAbsorbing = useRef(false);
  const currentY = useRef(item.position[1]);
  const velocityY = useRef(0);`;

const s2 = `    } else {
      // Bob gently up and down
      meshRef.current.position.x = item.position[0];
      meshRef.current.position.z = item.position[2];
      meshRef.current.position.y = item.position[1] + 0.2 + Math.sin(time * 3 + bobOffset) * 0.1;
    }`;

const r2 = `    } else {
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
      
      const floorY = groundY + 0.5;
      
      if (currentY.current > floorY) {
        velocityY.current -= 15 * delta;
        currentY.current += velocityY.current * delta;
        if (currentY.current < floorY) {
          currentY.current = floorY;
          velocityY.current = 0;
        }
      }

      meshRef.current.position.x = item.position[0];
      meshRef.current.position.z = item.position[2];
      meshRef.current.position.y = currentY.current + 0.2 + Math.sin(time * 3 + bobOffset) * 0.1;
    }`;

code = code.replace(s1, r1);
code = code.replace(s2, r2);
fs.writeFileSync('src/components/DroppedItemView.tsx', code);
