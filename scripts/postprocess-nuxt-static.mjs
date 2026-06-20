import { promises as fs } from 'node:fs'
import path from 'node:path'

const outputDir = path.resolve('.output/public')
const htmlFiles = ['index.html', '200.html', '404.html']

function rewriteHtml(html) {
  return html
    .replaceAll('href="/_nuxt/', 'href="./_nuxt/')
    .replaceAll('src="/_nuxt/', 'src="./_nuxt/')
    .replaceAll('href="/', 'href="./')
    .replaceAll('src="/', 'src="./')
    .replaceAll('baseURL:"/"', 'baseURL:"./"')
    .replaceAll('buildAssetsDir:"/_nuxt/"', 'buildAssetsDir:"./_nuxt/"')
}

async function main() {
  for (const fileName of htmlFiles) {
    const filePath = path.join(outputDir, fileName)
    const html = await fs.readFile(filePath, 'utf8')
    await fs.writeFile(filePath, rewriteHtml(html), 'utf8')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
