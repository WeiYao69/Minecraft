const fs = require('fs');
let code = fs.readFileSync('src/world/blocks.ts', 'utf8');
code = code.replace("sand: {", "bedrock: {\n    breakTime: Infinity,\n    canBreakByHand: false,\n    requiresTool: false,\n    requiredToolType: null,\n    drops: null,\n    dropCount: 0,\n  },\n  sand: {");
code = code.replace("WORLD_BLOCKS.push({ x, y: 0, z, type: isStone ? 'stone' : 'grass' });", "WORLD_BLOCKS.push({ x, y: -1, z, type: 'bedrock' });\n    WORLD_BLOCKS.push({ x, y: 0, z, type: isStone ? 'stone' : 'grass' });");
fs.writeFileSync('src/world/blocks.ts', code);
