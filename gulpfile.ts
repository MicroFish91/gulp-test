import * as fse from "fs-extra";
import * as gulp from "gulp";
import path from "path";
// import imagemin from "gulp-imagemin";

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

// // Optimize images, terminate by returning stream
// function optimizeImages() {
//   return gulp
//     .src("src/images/*")
//     .pipe(imagemin())
//     .pipe(gulp.dest("dist/images"));
// }

exports.correctMain = correctMain;
exports.testLogging = logMessage;
exports.testCopy = copyHtml;
// exports["imageMin"] = optimizeImages;
exports.default = async () => console.log("Running default");
