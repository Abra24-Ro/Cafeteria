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

// Copiar archivos HTML
function html() {
  return src("*.html")
    .pipe(dest("build"));
}

// Watch para desarrollo
function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*.{png,jpg,jpeg}", series(imagenWebp));
  watch("*.html", html);
}

// Tarea de build para producción (sin watch)
const build = series(imagenWebp, css, html);

// Tarea de desarrollo (con watch)
const desarrollo = series(imagenWebp, css, html, dev);

// Exportar tareas
export { imagenWebp, css, html, build, dev };
export default desarrollo;