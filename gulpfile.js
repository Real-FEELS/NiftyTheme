var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var terser = require("gulp-terser");
var uglifyCss = require("gulp-uglifycss");
var plumber = require("gulp-plumber");
var gulpif = require("gulp-if");
var notify = require("gulp-notify");
var gutil = require("gulp-util");
var argv = require("minimist");
var autoprefixer = require("gulp-autoprefixer");
var inlineCss = require("gulp-inline-css");

gulp.task("watch", function () {
  gulp.watch("scss/**/*.scss", ["nifty-theme"]);
});

gulp.task("nifty-theme", function () {
  return (
    gulp
    .src("scss/nifty.scss")
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: ["./scss/**/*"]
      }, {
        errLogToConsole: true
      })
    )
    .on("error", reportError)
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(concat("niftycompact.css"))
    // .pipe(uglifyCss()) // minify css
    .pipe(gulp.dest("./css/"))
    // .pipe(uglifyCss()) // minify css
    .pipe(gulp.dest("../memberdev/css/"))
  );
});


// gulp.task("nifty-theme-night", function () {
//   return (
//     gulp
//     .src("scss/nifty-night.scss")
//     .pipe(plumber())
//     .pipe(
//       sass({
//         includePaths: ["./scss/**/*"]
//       }, {
//         errLogToConsole: true
//       })
//     )
//     .on("error", reportError)
//     .pipe(
//       autoprefixer({
//         browsers: ["last 2 versions"],
//         cascade: false,
//       })
//     )
//     .pipe(concat("nifty-night.css"))
//     // .pipe(uglifyCss()) // minify css
//     .pipe(gulp.dest("./css/"))
//     // .pipe(uglifyCss()) // minify css
//     .pipe(gulp.dest("../memberdev/css/"))
//   );
// });


/// error handeling
var reportError = function (error) {
  var report = "\n";
  var chalk = gutil.colors.white.bgRed;

  if (error.plugin) {
    report += chalk("PLUGIN:") + " [" + error.plugin + "]\n";
  }

  if (error.message) {
    report += chalk("ERROR:\040") + " " + error.message + "\n";
  }

  console.error(report);

  // ----------------------------------------------
  // Notification

  if (error.line && error.column) {
    var notifyMessage = "LINE " + error.line + ":" + error.column + " -- ";
  } else {
    var notifyMessage = "";
  }

  notify({
    title: "FAIL: " + error.plugin,
    message: notifyMessage + "See console.",
    sound: "Sosumi", // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  gutil.beep(); // System beep (backup)

  // ----------------------------------------------
  // Prevent the 'watch' task from stopping

  this.emit("end");
};