const fs = require('fs');
const path = require('path');

// Create a simple base64 encoded PNG icon (green background with white text)
// This is a minimal 192x192 placeholder - replace with actual design later
const create192Icon = () => {
  // Using a data URI for a simple green square with Islamic symbolism
  const canvas = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
    <rect width="192" height="192" fill="#16a34a" rx="30"/>
    <path d="M 96 40 A 35 35 0 1 0 96 110 A 28 28 0 1 1 96 40 Z" fill="#ffffff"/>
    <path d="M 125 70 L 132 85 L 148 88 L 136 99 L 139 115 L 125 107 L 111 115 L 114 99 L 102 88 L 118 85 Z" fill="#ffffff"/>
    <rect x="70" y="120" width="52" height="42" fill="#ffffff" rx="2"/>
    <rect x="72" y="122" width="48" height="38" fill="#16a34a" rx="1"/>
    <line x1="96" y1="122" x2="96" y2="160" stroke="#ffffff" stroke-width="1"/>
    <line x1="78" y1="132" x2="90" y2="132" stroke="#ffffff" stroke-width="1"/>
    <line x1="78" y1="142" x2="90" y2="142" stroke="#ffffff" stroke-width="1"/>
    <line x1="102" y1="132" x2="114" y2="132" stroke="#ffffff" stroke-width="1"/>
    <line x1="102" y1="142" x2="114" y2="142" stroke="#ffffff" stroke-width="1"/>
  </svg>`;
  return canvas;
};

const create512Icon = () => {
  const canvas = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#16a34a" rx="80"/>
    <path d="M 256 100 A 100 100 0 1 0 256 300 A 80 80 0 1 1 256 100 Z" fill="#ffffff"/>
    <path d="M 340 180 L 355 210 L 387 215 L 363 238 L 369 270 L 340 255 L 311 270 L 317 238 L 293 215 L 325 210 Z" fill="#ffffff"/>
    <rect x="180" y="330" width="152" height="120" fill="#ffffff" rx="4"/>
    <rect x="186" y="336" width="140" height="108" fill="#16a34a" rx="2"/>
    <line x1="256" y1="336" x2="256" y2="444" stroke="#ffffff" stroke-width="2"/>
    <line x1="200" y1="360" x2="240" y2="360" stroke="#ffffff" stroke-width="2"/>
    <line x1="200" y1="380" x2="240" y2="380" stroke="#ffffff" stroke-width="2"/>
    <line x1="200" y1="400" x2="240" y2="400" stroke="#ffffff" stroke-width="2"/>
    <line x1="272" y1="360" x2="312" y2="360" stroke="#ffffff" stroke-width="2"/>
    <line x1="272" y1="380" x2="312" y2="380" stroke="#ffffff" stroke-width="2"/>
    <line x1="272" y1="400" x2="312" y2="400" stroke="#ffffff" stroke-width="2"/>
  </svg>`;
  return canvas;
};

// Write SVG files (browsers can use SVG directly in many cases)
const publicDir = path.join(__dirname, '../public');
fs.writeFileSync(path.join(publicDir, 'icon-192x192.svg'), create192Icon());
fs.writeFileSync(path.join(publicDir, 'icon-512x512.svg'), create512Icon());

console.log('✓ SVG icons generated successfully!');
console.log('\nNOTE: For production, convert these SVG files to PNG using:');
console.log('  - Online tool: https://realfavicongenerator.net/');
console.log('  - Or install sharp: npm install sharp');
console.log('\nFor now, the PWA will use SVG icons which work in most modern browsers.');
