import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: 'src/',
      // format: 'cjs',
    },
    // './src/index.ts',
  ],
  rollup: {
    // emitCJS: true,
  },
  hooks: {
    'build:before': async () => {
      // console.log(build)
    },
  },
  // Generates .d.ts declaration file
  declaration: true,
})
