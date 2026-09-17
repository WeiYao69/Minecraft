const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerHand.tsx', 'utf8');

const s1 = `      // Minecraft hand points largely forward and slightly inward
      groupRef.current.rotation.set(
        1.6 + swingRotX,  // Pitch forward
        -0.4 + swingRotY, // Yaw inward (left)
        -0.1 + swingRotZ  // Roll
      );`;

const r1 = `      // Minecraft hand points largely forward and slightly inward
      groupRef.current.rotation.set(
        1.6 + swingRotX,  // Pitch forward
        0.4 + swingRotY,  // Yaw inward (left) - positive Y rotation moves -Z towards -X
        -0.1 + swingRotZ  // Roll
      );`;

code = code.replace(s1, r1);
fs.writeFileSync('src/components/PlayerHand.tsx', code);
