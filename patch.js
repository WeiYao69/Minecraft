const fs = require('fs');
let code = fs.readFileSync('src/world/blocks.ts', 'utf8');
code = code.replace("sand: {", "bedrock: {\n    breakTime: Infinity,\n    canBreakByHand: false,\n    requiresTool: false,\n    requiredToolType: null,\n    drops: null,\n    dropCount: 0,\n  },\n  sand: {");
fs.writeFileSync('src/world/blocks.ts', code);
