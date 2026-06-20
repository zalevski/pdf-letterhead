# PDF Letterhead

Desktop app for applying a company letterhead PDF as a background to one or more input PDFs.

## Stack

- Electron
- Nuxt 4
- Vue 3
- TypeScript
- pdf-lib

## What it does

- Select one letterhead PDF.
- Select one or more input PDFs.
- Select an output directory.
- Generate one output PDF per input file.
- Preserve each input page size.
- Overlay the input page on top of the letterhead background.
- Support English, Polish, and German UI text.

## Scripts

- `npm run dev` - run Nuxt dev server and Electron together.
- `npm run build` - build the renderer and Electron main/preload code.
- `npm run electron:dev` - alias for `npm run dev`.
- `npm run electron:build` - build and package the app with electron-builder.
- `npm run typecheck` - run TypeScript type checking.

## Development

1. Install dependencies.
2. Run `npm run dev`.
3. The renderer runs on the Nuxt dev server, and Electron loads it automatically.

## Production build

1. Run `npm run electron:build`.
2. The Nuxt static output is bundled into the Electron package.

## Notes and limitations

- PDF processing happens locally inside the Electron main process.
- Encrypted PDFs are not supported.
- The app uses a practical page-overlay approach via `pdf-lib`; it does not preserve interactive PDF form behavior.
- The UI is client-side only and stores the selected language in localStorage.
- Packaging assumes a standard Electron desktop target and a writable output directory.
