import { dest, src, watch, series } from "gulp";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import webp from "gulp-webp";
import cssnano from "cssnano";

const scss = gulpSass(sass);

// Compilar SCSS
function css() {
  return src("src/scss/app.scss")
    .pipe(sourcemaps.init())
    .pipe(scss().on("error", scss.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css"));
}

// Copiar imágenes originales
function copiarImagenes() {
  return src("src/img/**/*.{png,jpg,jpeg}")
    .pipe(dest("build/img"));
}

// Convertir a WebP
function imagenWebp() {
  return src("src/img/**/*.{png,jpg,jpeg}")
    .pipe(webp())
    .pipe(dest("build/img"));
}

// Copiar archivos HTML
function html() {
  return src("*.html")
    .pipe(dest("build"));
}

// Watch
function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*.{png,jpg,jpeg}", series(copiarImagenes, imagenWebp));
  watch("*.html", html);
}

const build = series(copiarImagenes, imagenWebp, css, html);
const desarrollo = series(copiarImagenes, imagenWebp, css, html, dev);

export { imagenWebp, copiarImagenes, css, html, build, dev };
export default desarrollo;
