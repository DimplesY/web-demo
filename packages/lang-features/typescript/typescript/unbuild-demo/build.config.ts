import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index.ts',
  ],
  rollup: {
    cjsBridge: true,
  },
  declaration: true,
})
