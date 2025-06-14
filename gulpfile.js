import gulp from 'gulp';
import * as dartSass from 'sass';  // ✅ Corregido
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'cssnano';
import through2 from 'through2';

import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

import browserSyncLib from 'browser-sync';

const browserSync = browserSyncLib.create();
const sass = gulpSass(dartSass);
const { src, dest, watch, series } = gulp;

// Tarea: Compilar SASS, aplicar PostCSS (autoprefixer + minificar)
export function css(done) {
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
        .pipe(browserSync.stream());
    done();
}

// Tarea: Copiar archivos HTML a build
export function html() {
    return src('./*.html')
        .pipe(dest('build/'));
}

// Tarea: Copiar archivos JS si existen
export function js() {
    return src('src/js/**/*')
        .pipe(dest('build/js'));
}

// Tarea: Optimizar imágenes
export function imagenes() {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'));
}

// Tarea: Convertir imágenes a WebP
export function versionWebp() {
    const opciones = { quality: 50 };
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));
}

// Tarea: Convertir imágenes a AVIF (con mejor manejo de errores) ✅ Mejorado
export function versionAvif() {
    const opciones = { quality: 50 };
    return src('src/img/**/*.{png,jpg,jpeg}')
        .pipe(through2.obj(function(file, enc, cb) {
            // Verificar que el archivo sea válido antes de procesarlo
            if (file.isBuffer() && file.stat.size > 0) {
                const validExtensions = ['.png', '.jpg', '.jpeg'];
                const fileExt = file.extname.toLowerCase();
                
                if (validExtensions.includes(fileExt)) {
                    this.push(file);
                } else {
                    console.log(`⚠️ Skipping ${file.basename} - not a valid image format`);
                }
            }
            cb();
        }))
        .pipe(avif(opciones).on('error', function (err) {
            console.log('⚠️ AVIF conversion failed:', err.message);
            this.emit('end'); // Continúa con el resto aunque haya errores
        }))
        .pipe(dest('build/img'));
}

// Tarea: Servidor de desarrollo con BrowserSync
export function servidor(done) {
    browserSync.init({
        server: {
            baseDir: './'
        },
        notify: false,
        open: true
    });
    done();
}

// Tarea: Dev - observadores en SCSS, imágenes y HTML
export function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', series(imagenes, versionWebp, versionAvif)).on('change', browserSync.reload);
    watch('./*.html').on('change', browserSync.reload);
    watch('./build/js/**/*.js').on('change', browserSync.reload);
}

// Exportaciones para CLI
export const build = series(html, js, imagenes, versionWebp, versionAvif, css); // 👉 para producción
export default series(imagenes, versionWebp, versionAvif, css, servidor, dev); // 👉 para desarrollo