import dartSass from 'sass'
import { src, dest, series } from 'gulp'
import gulpSass from 'gulp-sass'
import gulpClean from 'gulp-clean'
import { resolve, join } from 'path'

const dist = resolve(__dirname, 'dist')
const base = resolve(__dirname, 'src')

function clean() {
  return src(dist, { read: false, allowEmpty: true }).pipe(gulpClean())
}

function buildSass() {
  const sass = gulpSass(dartSass)
  return src(join(base, 'styles', '**', '*.scss'))
    .pipe(sass.sync())
    .on('error', sass.logError)
    .pipe(dest(join(dist, 'css')))
}

export const build = buildSass

export default series(clean, build)
