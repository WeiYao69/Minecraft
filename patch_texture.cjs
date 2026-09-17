const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerHand.tsx', 'utf8');

const s1 = `      // Right side bottom patch
      ctx.fillRect(10, 19, 4, 13);
    }`;

const r1 = `      // Right side bottom patch
      ctx.fillRect(10, 19, 4, 13);
      
      // Imply fingers with vertical lines at the top (which maps to the hand tip)
      ctx.fillStyle = '#6b442a';
      ctx.fillRect(4, 0, 1, 5);
      ctx.fillRect(8, 0, 1, 5);
      ctx.fillRect(12, 0, 1, 5);
    }`;

code = code.replace(s1, r1);
fs.writeFileSync('src/components/PlayerHand.tsx', code);
