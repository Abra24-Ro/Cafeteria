import { dest, src, watch, series } from "gulp";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

const scss = gulpSass(sass);

// ✅ Compilar SCSS
function css() {
  return src("src/scss/app.scss")
    .pipe(sourcemaps.init())
    .pipe(scss().on("error", scss.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css"));
}

// ✅ Copiar HTML
function html() {
  return src("*.html").pipe(dest("build"));
}

// ✅ Watch sin imágenes
function dev() {
  watch("src/scss/**/*.scss", css);
  watch("*.html", html);
}

// ✅ Build final sin imágenes
const build = series(css, html);
const desarrollo = series(css, html, dev);

export { css, html, build, dev };
export default desarrollo;