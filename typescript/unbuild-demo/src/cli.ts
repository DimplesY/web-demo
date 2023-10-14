import process from 'node:process'
import mri from 'mri'

console.log(mri(process.argv.slice(2)))
