import fs from 'fs';
import path from 'path';

export function moveFile(src: string, dest: string): void {
  const fileName = path.basename(src);
  const destPath = path.join(dest, fileName);

  try {
    fs.rename(src, destPath, (err) => {
      if (err) throw err;
      console.log(`${fileName} has been moved to ${dest}`);
    });
  } catch (error) {
    console.error(JSON.stringify(error));
  }
  
}
