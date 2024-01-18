import { loadConfig } from 'unconfig'


const loader = await loadConfig({
  sources: [
    {
      files: 'my.yaml',
      extensions: [],
      rewrite(obj, filepath) {
          console.log(obj)
          console.log(filepath)
          return {
            name: 'a'
          }
      },
    },
  ]
})


console.log(loader)
