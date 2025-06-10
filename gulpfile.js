import { dest, src, watch, series } from "gulp";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { deleteAsync } from "del"; // 👉 npm install del

const scss = gulpSass(sass);

// ✅ Limpiar carpeta build
function limpiar() {
  return deleteAsync(['build']);
}

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

// ✅ Copiar imágenes sin convertir
function copiarImagenes() {
  return src("src/img/**/*.*", { allowEmpty: true }) // Copia cualquier imagen
    .pipe(dest("build/img"));
}

// ✅ Copiar JS
function javascript() {
  return src("src/js/**/*.js").pipe(dest("build/js"));
}

// ✅ Watch (modo desarrollo)
function dev() {
  watch("src/scss/**/*.scss", css);
  watch("*.html", html);
  watch("src/img/**/*.*", copiarImagenes);
  watch("src/js/**/*.js", javascript);
}

// ✅ Build final (limpia antes)
const build = series(limpiar, css, html, copiarImagenes, javascript);
const desarrollo = series(limpiar, css, html, copiarImagenes, javascript, dev);

export { css, html, copiarImagenes, javascript, build, dev };
export default desarrollo;
