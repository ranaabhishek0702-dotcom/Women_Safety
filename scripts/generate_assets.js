const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Minimal valid 1x1 PNG in base64 (dark slate blue #0B0F19)
const darkBluePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwGA0b3vPgAAAABJRU5ErkJggg==';
const buffer = Buffer.from(darkBluePngBase64, 'base64');

['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'].forEach((file) => {
  const filePath = path.join(assetsDir, file);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created asset: ${filePath}`);
});
console.log('All placeholder assets generated successfully.');
