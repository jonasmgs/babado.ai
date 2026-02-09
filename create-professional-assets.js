import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SVG Logo - Viral Story Icon with AI Brain + Speech Bubble
const iconSVG = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6d28d9;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="512" cy="512" r="480" fill="url(#grad1)"/>
  
  <!-- Speech Bubble representing stories -->
  <path d="M 312 312 Q 312 262 352 262 L 672 262 Q 712 262 712 312 L 712 532 Q 712 582 672 582 L 492 582 L 412 682 L 412 582 L 352 582 Q 312 582 312 532 Z" 
        fill="white" opacity="0.95"/>
  
  <!-- AI Circuit Pattern inside -->
  <circle cx="442" cy="387" r="28" fill="url(#grad2)"/>
  <circle cx="582" cy="387" r="28" fill="url(#grad2)"/>
  <circle cx="512" cy="487" r="28" fill="url(#grad2)"/>
  
  <line x1="442" y1="387" x2="512" y2="487" stroke="url(#grad2)" stroke-width="8" stroke-linecap="round"/>
  <line x1="582" y1="387" x2="512" y2="487" stroke="url(#grad2)" stroke-width="8" stroke-linecap="round"/>
  <line x1="442" y1="387" x2="582" y2="387" stroke="url(#grad2)" stroke-width="8" stroke-linecap="round"/>
  
  <!-- Sparkles for viral/trending -->
  <path d="M 742 212 L 752 242 L 782 252 L 752 262 L 742 292 L 732 262 L 702 252 L 732 242 Z" 
        fill="#f97316" opacity="0.9"/>
  <path d="M 262 662 L 272 692 L 302 702 L 272 712 L 262 742 L 252 712 L 222 702 L 252 692 Z" 
        fill="#22c55e" opacity="0.9"/>
  <path d="M 812 562 L 822 592 L 852 602 L 822 612 L 812 642 L 802 612 L 772 602 L 802 592 Z" 
        fill="#fbbf24" opacity="0.9"/>
</svg>`;

// Splash Screen SVG - Minimal and elegant
const splashSVG = `<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6d28d9;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1284" height="2778" fill="url(#bgGrad)"/>
  
  <!-- Centered Logo Icon -->
  <g transform="translate(342, 1139)">
    <!-- Speech Bubble -->
    <path d="M 100 100 Q 100 50 140 50 L 460 50 Q 500 50 500 100 L 500 320 Q 500 370 460 370 L 280 370 L 200 470 L 200 370 L 140 370 Q 100 370 100 320 Z" 
          fill="white" opacity="0.95"/>
    
    <!-- AI Circuit -->
    <circle cx="230" cy="175" r="24" fill="#7c3aed"/>
    <circle cx="370" cy="175" r="24" fill="#7c3aed"/>
    <circle cx="300" cy="275" r="24" fill="#7c3aed"/>
    
    <line x1="230" y1="175" x2="300" y2="275" stroke="#7c3aed" stroke-width="6" stroke-linecap="round"/>
    <line x1="370" y1="175" x2="300" y2="275" stroke="#7c3aed" stroke-width="6" stroke-linecap="round"/>
    <line x1="230" y1="175" x2="370" y2="175" stroke="#7c3aed" stroke-width="6" stroke-linecap="round"/>
  </g>
  
  <!-- App Name -->
  <text x="642" y="1700" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
        text-anchor="middle" fill="white">Babado.ai</text>
  <text x="642" y="1770" font-family="Arial, sans-serif" font-size="36" 
        text-anchor="middle" fill="white" opacity="0.9">Viral Story Creator</text>
  
  <!-- Sparkles -->
  <path d="M 200 800 L 210 830 L 240 840 L 210 850 L 200 880 L 190 850 L 160 840 L 190 830 Z" 
        fill="white" opacity="0.7"/>
  <path d="M 1084 950 L 1094 980 L 1124 990 L 1094 1000 L 1084 1030 L 1074 1000 L 1044 990 L 1074 980 Z" 
        fill="white" opacity="0.7"/>
  <path d="M 150 1900 L 160 1930 L 190 1940 L 160 1950 L 150 1980 L 140 1950 L 110 1940 L 140 1930 Z" 
        fill="#f97316" opacity="0.8"/>
  <path d="M 1100 2000 L 1110 2030 L 1140 2040 L 1110 2050 L 1100 2080 L 1090 2050 L 1060 2040 L 1090 2030 Z" 
        fill="#22c55e" opacity="0.8"/>
</svg>`;

// Adaptive Icon SVG - Android
const adaptiveIconSVG = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Main Speech Bubble -->
  <path d="M 212 212 Q 212 162 252 162 L 772 162 Q 812 162 812 212 L 812 632 Q 812 682 772 682 L 492 682 L 312 862 L 312 682 L 252 682 Q 212 682 212 632 Z" 
        fill="url(#iconGrad)"/>
  
  <!-- AI Brain Circuit Pattern -->
  <circle cx="412" cy="347" r="42" fill="white"/>
  <circle cx="612" cy="347" r="42" fill="white"/>
  <circle cx="512" cy="547" r="42" fill="white"/>
  
  <line x1="412" y1="347" x2="512" y2="547" stroke="white" stroke-width="12" stroke-linecap="round"/>
  <line x1="612" y1="347" x2="512" y2="547" stroke="white" stroke-width="12" stroke-linecap="round"/>
  <line x1="412" y1="347" x2="612" y2="347" stroke="white" stroke-width="12" stroke-linecap="round"/>
  
  <!-- Small nodes on connections -->
  <circle cx="462" cy="447" r="16" fill="white"/>
  <circle cx="562" cy="447" r="16" fill="white"/>
  
  <!-- Viral spark -->
  <path d="M 742 112 L 762 152 L 802 172 L 762 192 L 742 232 L 722 192 L 682 172 L 722 152 Z" 
        fill="#f97316"/>
</svg>`;

// Convert SVG to PNG using a simple method
function svgToPngBuffer(svgString, width, height) {
  // For Node.js without canvas, we'll save as SVG and let the system handle it
  // In production, you'd use a library like sharp or canvas
  return Buffer.from(svgString);
}

const assetsDir = path.join(__dirname, 'assets');

// Save SVG files
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), iconSVG);
fs.writeFileSync(path.join(assetsDir, 'splash.svg'), splashSVG);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.svg'), adaptiveIconSVG);

console.log('✅ Professional SVG logos created!');
console.log('📁 Files created:');
console.log('   - assets/icon.svg');
console.log('   - assets/splash.svg');
console.log('   - assets/adaptive-icon.svg');
console.log('');
console.log('⚠️  Note: You need to convert SVG to PNG for Expo.');
console.log('   Use: npx @expo/image-utils or an online converter');
