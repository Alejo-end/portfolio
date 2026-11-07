// Lists public/media into src/data/media.json, so pages know the gallery files
// without reading the disk at request time (public/ is not in the functions).
// Runs before dev, build and typecheck.
import { readdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = join(process.cwd(), 'public', 'media')
const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.name.startsWith('.') ? [] : entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
    )
const files = walk(root)
    .map((file) => relative(root, file).split('\\').join('/'))
    .sort()
writeFileSync(join(process.cwd(), 'src', 'data', 'media.json'), JSON.stringify(files, null, 2) + '\n')
console.log(`media.json: ${files.length} files`)
