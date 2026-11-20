// Lists public/media into src/data/media.json, so pages know the gallery files
// without reading the disk at request time (public/ is not in the functions).
// Also measures every picture under public/ into src/data/sizes.json, so a
// page can hold each picture's place before it loads and nothing jumps.
// And it makes a share card per project into public/og/ (not committed): the
// picture a chat app or LinkedIn shows next to a link to that project.
// Runs before dev, build and typecheck.
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import sharp from 'sharp'

const pub = join(process.cwd(), 'public')
const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.name.startsWith('.') ? [] : entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
    )
const posix = (from, file) => relative(from, file).split('\\').join('/')
const write = (name, data) => writeFileSync(join(process.cwd(), 'src', 'data', name), JSON.stringify(data, null, 2) + '\n')

const root = join(pub, 'media')
const files = walk(root)
    .map((file) => posix(root, file))
    .sort()
write('media.json', files)

// Width and height as the browser shows them: a photo turned by its EXIF
// orientation counts turned.
const pictures = ['media', 'videos', 'images']
    .flatMap((dir) => walk(join(pub, dir)))
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort()
const sizes = {}
for (const file of pictures) {
    const { width, height, orientation = 1 } = await sharp(file).metadata()
    sizes[`/${posix(pub, file)}`] = orientation >= 5 ? [height, width] : [width, height]
}
// One picture per line, so a new one is one line in a diff.
const lines = Object.entries(sizes).map(([url, size]) => `  ${JSON.stringify(url)}: ${JSON.stringify(size)}`)
writeFileSync(join(process.cwd(), 'src', 'data', 'sizes.json'), `{\n${lines.join(',\n')}\n}\n`)
// Share cards are 1200 by 630, the shape link previews expect, and a small
// JPEG instead of the full-size original. A picture close to that shape fills
// the card. A tall one, or a cut-out with no background of its own, sits
// whole on the site's light gray.
const CARD = { width: 1200, height: 630 }
const GRAY = '#f0f0f0'
const og = join(pub, 'og')
mkdirSync(og, { recursive: true })
let cards = 0
for (const alias of readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'posters').map((d) => d.name)) {
    const first = pictures.filter((file) => posix(root, file).startsWith(`${alias}/`))[0]
    if (!first) continue
    const target = join(og, `${alias}.jpg`)
    // Made once per picture: skipped while the card is newer than its source.
    if (existsSync(target) && statSync(target).mtimeMs > statSync(first).mtimeMs) continue
    const [width, height] = sizes[`/${posix(pub, first)}`]
    const { hasAlpha } = await sharp(first).metadata()
    const shape = width / height
    const fills = !hasAlpha && shape > 1.3 && shape < 2.8
    const card = fills
        ? sharp(first).rotate().resize({ ...CARD, fit: 'cover', position: 'attention' })
        : sharp({ create: { ...CARD, channels: 3, background: GRAY } }).composite([
              { input: await sharp(first).rotate().resize({ width: CARD.width - 96, height: CARD.height - 96, fit: 'inside' }).png().toBuffer() },
          ])
    await card.flatten({ background: GRAY }).jpeg({ quality: 82, mozjpeg: true }).toFile(target)
    cards++
}
console.log(`media.json: ${files.length} files, sizes.json: ${pictures.length} pictures, ${cards} new share cards`)
