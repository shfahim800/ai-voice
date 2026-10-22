import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const androidDir = path.join(rootDir, 'android');
const publicDir = path.join(rootDir, 'public');

function addDirectoryToZip(zip, dirPath, rootPath) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relPath = path.relative(rootPath, fullPath).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addDirectoryToZip(zip, fullPath, rootPath);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.file(relPath, content);
    }
  }
}

async function exportAndroidZip() {
  if (!fs.existsSync(androidDir)) {
    console.error('Android directory does not exist!');
    return;
  }

  const zip = new JSZip();
  // Add all files from android/ to the zip root
  addDirectoryToZip(zip, androidDir, androidDir);

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  fs.mkdirSync(publicDir, { recursive: true });
  const outputPath = path.join(publicDir, 'Friday420_AI_Assistant_Native_Kotlin_Android_SDK.zip');
  fs.writeFileSync(outputPath, buffer);
  const shOutputPath = path.join(publicDir, 'SH_AI_Assistant_Android_Studio_Project.zip');
  fs.writeFileSync(shOutputPath, buffer);

  console.log(`Native Android Studio Kotlin Project exported successfully: ${outputPath} and ${shOutputPath}`);
}

exportAndroidZip().catch(console.error);
