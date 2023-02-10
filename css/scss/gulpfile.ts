import dartSass from 'sass'
import { src, dest } from 'gulp'
import gulpSass from 'gulp-sass'

export const build = () => {
  const sass = gulpSass(dartSass)
  return src('scss/**/*.scss')
    .pipe(sass.sync())
    .on('error', sass.logError)
    .pipe(dest('css'))
}

export default build
