import { defineConfig, presetUno, presetAttributify, presetTagify, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  preflights: [
    {
      getCSS: () => `
        * {
          padding: 0;
          margin: 0;
        }
      `,
    },
  ],
  presets: [
    presetUno({
      dark: 'class',
    }),
    presetAttributify(),
    presetTagify(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
