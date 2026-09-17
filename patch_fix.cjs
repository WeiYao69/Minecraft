const fs = require('fs');
let code = fs.readFileSync('src/components/DroppedItemView.tsx', 'utf8');

code = code.replace("  const currentY = useRef(item.position[1]);\n  const velocityY = useRef(0);\n  const currentY = useRef(item.position[1]);\n  const velocityY = useRef(0);", "  const currentY = useRef(item.position[1]);\n  const velocityY = useRef(0);");

fs.writeFileSync('src/components/DroppedItemView.tsx', code);
