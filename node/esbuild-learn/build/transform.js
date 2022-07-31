const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../index.ts');
const code = esbuild.transformSync(fs.readFileSync(filePath).toString(), {
    loader: 'ts',
    minify:true
}).code
console.log(code);
