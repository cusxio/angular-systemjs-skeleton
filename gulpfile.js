var config = require('./gulp.config.js'),
    gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    sass = require('gulp-sass'),
    lost = require('lost'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
    argv = require('yargs').argv,
    historyApiFallback = require('connect-history-api-fallback'),
    eslint = require('gulp-eslint'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    runSequence = require('run-sequence');

// SERVER
function findEnvironment() {
    if (!argv.production && !argv.development) {
        return 'DEV';
    } else if (argv.production) {
        return 'PROD';
    } else if (argv.development) {
        return 'DEV';
    }
}

function browserSyncConfig(baseDir, port) {
    browserSync.init({
        server: {
            baseDir: baseDir,
            middleware: [historyApiFallback()],
            routes: {
                '/system.config.js': './system.config.js',
                '/jspm_packages': './jspm_packages'
            }
        },
        port: port
    });
}
gulp.task('server', function() {
    var startBrowserSync;
    var environment = findEnvironment();
    switch (environment) {
        case 'DEV':
        case 'dev':
            startBrowserSync = browserSyncConfig(['./src', '.tmp'], 3000);
            break;
        case 'PROD':
        case 'prod':
            startBrowserSync = browserSyncConfig('./dist', 1337);
            break;
    }
    return startBrowserSync;
});


// SASS
gulp.task('sass', function() {
    var processors = [autoprefixer({
        browsers: ['last 1 version']
    }), lost];
    return gulp.src(config.sass)
        .pipe(plumber({
            errorHandler: function(err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            indentedSyntax: true
        }).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest(config.tmp.styles))
        .pipe(browserSync.stream());
});

// SCRIPTS
gulp.task('lint', function() {
    return gulp.src(config.scripts)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('babel', function() {
    return gulp.src(config.scripts)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tmp.scripts));
});

// WATCH
gulp.task('watch', function() {
    gulp.watch(config.sass, ['sass']);
    gulp.watch(config.scripts, ['babel']);
    gulp.watch(config.scripts).on('change', browserSync.reload);
    gulp.watch(config.html).on('change', browserSync.reload);

});


// Final Tasks
gulp.task('default', function() {
    var tasks;
    var environment = findEnvironment();
    switch (environment) {
        case 'DEV':
        case 'dev':
            tasks = ['sass', 'babel', 'watch'];
            break;
        case 'PROD':
        case 'prod':
            // tasks = TODO , build, optimize etc..
            break;
    }
    runSequence(
        tasks, 'server'
    );
});
