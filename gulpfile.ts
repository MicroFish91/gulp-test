import del from "del";
import * as fse from "fs-extra";
import * as gulp from "gulp";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import ts from "gulp-typescript";
import uglify from "gulp-uglify";
import path from "path";

// Corrects console.warn to console.log
async function correctMain() {
  const mainJsPath: string = path.join(__dirname, "src/main.ts");
  let contents = (await fse.readFile(mainJsPath)).toString();
  contents = contents.replace("warn", "log");
  await fse.writeFile(mainJsPath, contents);
}

// Log message to console, terminate using cb
function logMessage(done: gulp.TaskFunctionCallback) {
  console.log("Logging message.");
  done();
}

// Copy all html files from src => dist, terminate by returning stream
function copyHtml() {
  return gulp.src("src/*.html").pipe(gulp.dest("dist"));
}

// Clear temp and dist folders
function cleanAll() {
  return del(["./tmp", "./dist"]);
}

// Convert ts files to js, store in tmp folder
function transpileTs() {
  const tsProject = ts.createProject("./tsconfig.json");
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(sourcemaps.write())
    .pipe(gulp.dest("./tmp/js"));
}

// Combine & compress js files in tmp folder into one file and migrate final to dist/
function compressJs() {
  return gulp
    .src("./tmp/**/*.js")
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(concat("App.min.js"))
    .pipe(sourcemaps.write("./sourcemaps"))
    .pipe(gulp.dest("./dist/js"));
}

exports.correctMain = correctMain;
exports.testLogging = logMessage;
exports.testCopy = copyHtml;
exports.default = gulp.series(
  cleanAll,
  copyHtml,
  correctMain,
  transpileTs,
  compressJs
);
