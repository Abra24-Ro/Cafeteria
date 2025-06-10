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
  return src("*.html")
    .pipe(dest("build"));
}

// ✅ NUEVO: Copiar imágenes tal cual
function copiarImagenes() {
  return src("src/img/**/*.{png,jpg,jpeg,svg,webp,gif}")
    .pipe(dest("build/img"));
}

// ✅ Watch
function dev() {
  watch("src/scss/**/*.scss", css);
  watch("*.html", html);
  watch("src/img/**/*.{png,jpg,jpeg,svg,webp,gif}", copiarImagenes);
}

// ✅ Build final
const build = series(css, html, copiarImagenes);
const desarrollo = series(css, html, copiarImagenes, dev);

export { css, html, copiarImagenes, build, dev };
export default desarrollo;
