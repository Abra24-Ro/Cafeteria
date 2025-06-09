import { dest, src, watch, series } from "gulp";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import webp from "gulp-webp";
import cssnano from "cssnano";

// Compilador Sass
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

// Convertir a WebP
function imagenWebp() {
  return src("src/img/**/*.{png,jpg,jpeg}")
    .pipe(webp())
    .pipe(dest("build/img"));
}

// Watch para desarrollo
function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*.{png,jpg,jpeg}", series(imagenWebp));
}

// Exportar tareas
export { imagenWebp };
export default series(imagenWebp, css, dev);
