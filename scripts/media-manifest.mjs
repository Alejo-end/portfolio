// Lists public/media into src/data/media.json, so pages know the gallery files
// without reading the disk at request time (public/ is not in the functions).
// Also measures every picture under public/ into src/data/sizes.json, so a
// page can hold each picture's place before it loads and nothing jumps.
// Runs before dev, build and typecheck.
import { readdirSync, writeFileSync } from 'node:fs'
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
console.log(`media.json: ${files.length} files, sizes.json: ${pictures.length} pictures`)
