import {
  defineConfig,
  presetAttributify,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({
      dark: 'class',
      preflights: {
        reset: true,
      },
    }),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        mono: ['DM Mono:400,700'],
      },
    }),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
