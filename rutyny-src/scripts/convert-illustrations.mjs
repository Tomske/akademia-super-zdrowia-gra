/* Konwersja oryginalnych plansz PNG do WebP używanego przez apkę.
   Użycie: node scripts/convert-illustrations.mjs <folder-z-oryginalnymi-PNG>
   Wynik trafia do public/illustrations/rutyna-XX.webp (1400 px szerokości, q80).
   Oryginały (2480x3508, ~6 MB/szt.) trzymamy poza repo, w folderze klienta Hadron OS. */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const src = process.argv[2]
if (!src) { console.error('Podaj folder źródłowy z plikami rutyna-XX.png'); process.exit(1) }
const dst = 'public/illustrations'

for (const file of fs.readdirSync(src).filter(f => /^rutyna-\d\d\.png$/.test(f))) {
  const out = path.join(dst, file.replace('.png', '.webp'))
  await sharp(path.join(src, file)).resize({ width: 1400 }).webp({ quality: 80 }).toFile(out)
  console.log(file, '->', out, Math.round(fs.statSync(out).size / 1024) + ' KB')
}
