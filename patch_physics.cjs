const fs = require('fs');
let code = fs.readFileSync('src/components/PhysicsEngine.tsx', 'utf8');
code = code.replace("if (BLOCK_PROPERTIES[block.type].gravityAffected) {", "if (block.type !== 'bedrock') {");
fs.writeFileSync('src/components/PhysicsEngine.tsx', code);
