var gulp = require('gulp');

var addStream            = require('add-stream');
var angularTemplatecache = require('gulp-angular-templatecache');
var concat               = require('gulp-concat');
var express              = require('gulp-express');
var header               = require('gulp-header');
var sourcemaps           = require('gulp-sourcemaps');
var uglify               = require('gulp-uglify');

var bower = require(__dirname + '/bower.json');
var banner = ['/**',
    ' * <%= bower.name %> - <%= bower.description %>',
    ' * @version v<%= bower.version %>',
    ' * @link <%= bower.homepage %>',
    ' * @license <%= bower.license %>',
    ' */',
    ''].join('\n');

function prepareTemplates() {
    return gulp.src(__dirname + '/src/directives/decorators/bootstrap/**/*.html')
        //.pipe(minify and preprocess the template html here)
        .pipe(angularTemplatecache({
            module: 'schemaFormWizard'
        }));
}

gulp.task('build-app-dev', function() {
    return gulp.src(__dirname + '/src/schema-form-wizard.js')
        //.pipe(concat your app js files somehow)
        .pipe(sourcemaps.init())

        // append the template js onto one file
        .pipe(addStream.obj(prepareTemplates()))
        .pipe(concat('schema-form-wizard.js'))

        .pipe(sourcemaps.write())
        .pipe(header(banner, { bower : bower } ))
        .pipe(gulp.dest(__dirname + '/dist'));
});


gulp.task('build-app-prod', function() {
    return gulp.src(__dirname + '/src/schema-form-wizard.js')
        //.pipe(concat your app js files somehow)

        // append the template js onto one file
        .pipe(addStream.obj(prepareTemplates()))
        .pipe(concat('schema-form-wizard.min.js'))

        .pipe(uglify())
        .pipe(header(banner, { bower : bower } ))
        .pipe(gulp.dest(__dirname + '/dist'));
});

gulp.task('default', ['build-app-dev', 'build-app-prod']);

// connect local server
gulp.task('server', function() {
    express.run([__dirname + '/demo/index.js']);
});
