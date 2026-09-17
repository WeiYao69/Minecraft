const fs = require('fs');
let code = fs.readFileSync('src/components/VoxelBlock.tsx', 'utf8');
code = code.replace("if (type === 'dirt')", "if (type === 'bedrock') {\n    return (\n      <mesh ref={meshRef} position={position}>\n        <boxGeometry args={[1, 1, 1]} />\n        <meshStandardMaterial map={stoneTexture} color=\"#333333\" />\n      </mesh>\n    );\n  }\n\n  if (type === 'dirt')");
fs.writeFileSync('src/components/VoxelBlock.tsx', code);
