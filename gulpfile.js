var gulp = require("gulp"),
  pkg = require("./package.json"),
  marigold = require("marigold").setup(gulp, pkg),

  css = marigold.css(["*.styl"]),

  html = marigold.html(["*.pug"]),

  images = marigold.images(["*.png", "*.jpg", "*.gif", "*.svg", "img/*.png", "img/*.jpg", "img/*.svg"]),

  devServer = marigold.devServer([
      "*.pug",
      "*.styl"
    ], [
      "!gulpfile.js",
      "*.css",
      "*.html"
    ], {
      path: ".",
      url: ""
    });

marigold.taskify(
  [
    html,
    css,
    images
  ], {
    default: devServer
  });

gulp.task("test", gulp.series(["release"]), devServer);
