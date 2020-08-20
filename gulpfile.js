let final = "dist"; // папка куда собирается
let source = "#source"; // исходная папка

// набор путей к файлам
let path = {
  // куда выгружать
  build: {
    html: final + "/",
    css: final + "/css/",
    js: final + "/js/",
    img: final + "/img/",
    fonts: final + "/fonts/",
  },
  // откуда берём
  src: {
    html: [source + "/*.html", "!" + source + "/_*.html"], //берём файлы без "_", через исключение "!"
    css: source + "/scss/style.scss", // конвертируем только один общий файл
    js: source + "/js/*.js",
    fonts: source + "/fonts/*.{otf,ttf,woff,woff2}",
    img: source + "/img/**/*.{jpg,png,svg,gif,ico,webp}", //файлы только этих расширений
  },
  //где будем отслеживать изменения
  watch: {
    html: source + "/**/*.html",
    css: source + "/scss/**/*.scss", // слушаем все .scss
    js: source + "/js/**/*.js",
    img: source + "/img/**/*.{jpg,png,svg,gif,ico,webp}", //файлы только этих расширений
  },
  clean: "./" + final + "/", // удаление проекта каждый раз как запускаем gulp
};

// Импортируем специфические функции gulp API, что позволит писать их как src() вместо длинного gulp.src()
let { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(), // назначаем переменную плагину и создаём сервер
  // fileinclude = require("gulp-file-include"),
  del = require("del"),
  scss = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  clean_css = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify-es").default,
  imagemin = require("gulp-imagemin");
//concat = require("gulp-concat");

function browserSync(params) {
  // настройка плагина обновления страницы
  browsersync.init({
    server: {
      baseDir: "./" + final + "/", // базовая папка
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return (
    src(path.src.html) // метод src - откуда брать файлы
      // .pipe(fileinclude())
      .pipe(dest(path.build.html)) // метод dest - куда положить файлы
      .pipe(browsersync.stream())
  );
}

function css() {
  return (
    src(path.src.css)
      .pipe(
        scss({
          outputStyle: "expanded", // настройка sass
        })
      )
      //  .pipe(group_media())
      .pipe(
        autoprefixer({
          overridebrowserslist: ["last 2 versions"],
          cascade: true,
        })
      )
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
        rename({
          extname: ".min.css",
        })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
  );
}

function js() {
  return (
    src(path.src.js)
      //  .pipe(concat("script.js")) // !concat
      .pipe(dest(path.build.js))
      .pipe(uglify())
      .pipe(
        rename({
          extname: ".min.js",
        })
      )
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
  );
}

function images() {
  return src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [
          {
            removeViewBox: false,
          },
        ],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts() {
  return src(path.src.fonts).pipe(dest(path.build.fonts));
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html); // метод watch - 1) где смотреть изменения 2) что запускать при изменениях
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean(params) {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync); // сценарий выполнения

// подружить gulp с новыми функциями
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch; // запускаем gulp - запускается эта переменная по умолчанию
