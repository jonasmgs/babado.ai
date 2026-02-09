import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetsDir = path.join(__dirname, 'assets');

async function convertSVGtoPNG() {
  try {
    console.log('🎨 Converting SVG to PNG...');
    
    // Icon 1024x1024
    await sharp(path.join(assetsDir, 'icon.svg'))
      .resize(1024, 1024)
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));
    console.log('✅ icon.png created');
    
    // Splash 1284x2778
    await sharp(path.join(assetsDir, 'splash.svg'))
      .resize(1284, 2778)
      .png()
      .toFile(path.join(assetsDir, 'splash.png'));
    console.log('✅ splash.png created');
    
    // Adaptive Icon 1024x1024
    await sharp(path.join(assetsDir, 'adaptive-icon.svg'))
      .resize(1024, 1024)
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('✅ adaptive-icon.png created');
    
    console.log('');
    console.log('🎉 All professional logos created successfully!');
    console.log('📱 Reload your Expo app to see the new logos');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

convertSVGtoPNG();
