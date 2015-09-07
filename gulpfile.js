var config = require('./gulp.config.js'),
    pkg = require('./package.json'),
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
    runSequence = require('run-sequence'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    gutil = require('gulp-util'),
    log = gutil.log,
    bytediff = require('gulp-bytediff'),
    minifyCss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    rev = require('gulp-rev'),
    header = require('gulp-header'),
    moment = require('moment'),
    deleteLines = require('gulp-delete-lines'),
    inject = require('gulp-inject'),
    uglify = require('gulp-uglify');


/**
 *
 * SERVER
 *
 */
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
            startBrowserSync = browserSyncConfig(['src/', '.tmp'], 3000);
            break;
        case 'PROD':
        case 'prod':
            startBrowserSync = browserSyncConfig('dist/', 1337);
            break;
    }
    return startBrowserSync;
});


/**
 *
 * SASS
 *
 */
gulp.task('sass', function() {
    var processors = [autoprefixer({
        browsers: ['last 1 version']
    }), lost];
    return gulp.src(config.src.sass)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass({
            indentedSyntax: true
        }).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest(config.tmp.styles))
        .pipe(browserSync.stream());
});

/**
 *
 * SCRIPTS
 *
 */
gulp.task('lint', function() {
    return gulp.src(config.src.scripts)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('babel', function() {
    return gulp.src(config.src.scripts)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tmp.scripts));
});

gulp.task('scripts', function() {
    gulp.src(config.tmp.scripts + '/**/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(bytediff.start())
        .pipe(uglify())
        .pipe(bytediff.stop(bytediffFormatter))
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(header(banner))
        .pipe(gulp.dest(config.dist.basePath));
})

/**
 *
 * ASSETS
 *
 */
gulp.task('images', function() {
    return gulp.src(config.src.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.dist.images));
});

gulp.task('fonts', function() {
    return gulp.src(config.src.fonts)
        .pipe(gulp.dest(config.dist.fonts));
});

/**
 *
 * CSS
 *
 */
gulp.task('css', function() {
    return gulp.src(config.tmp.styles + '/**/*.css')
        .pipe(bytediff.start())
        .pipe(minifyCss())
        .pipe(bytediff.stop(bytediffFormatter))
        .pipe(rev())
        .pipe(header(banner))
        .pipe(gulp.dest(config.dist.styles));
});

/**
 *
 * HTML
 *
 */
gulp.task('html', function() {
    return gulp.src(config.src.html)
        .pipe(deleteLines({
            'filters': [
                /<link\b.+href="(?!http)([^"]*)(".*>)/gm
            ]
        }))
        //        .pipe(deleteLines({
        //            'filters': [
        //                /<script\b[^>]*>([\s\S]*?)<\/script>/gm
        //            ]
        //        }))
        .pipe(inject(gulp.src(config.dist.styles + '/**/*.css', {
            read: false
        }), {
            ignorePath: 'dist'
        }))
        .pipe(bytediff.start())
        .pipe(minifyHTML())
        .pipe(bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(config.dist.basePath));
});


/**
 *
 * WATCH
 *
 */
gulp.task('watch', function() {
    gulp.watch(config.src.sass, ['sass']);
    gulp.watch(config.src.scripts, ['babel']);
    gulp.watch(config.src.scripts).on('change', browserSync.reload);
    gulp.watch(config.src.html).on('change', browserSync.reload);
});

/**
 *
 *  BUILD
 *
 */
gulp.task('build', function(cb) {
    runSequence(
        ['fonts', 'images', 'css', 'scripts'], ['html'], cb
    );
});


/**
 *
 * TASKS
 *
 */
gulp.task('serve', function(cb) {
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
            tasks = ['build'];
            break;
    }
    runSequence(
        tasks , ['server'], cb
    );
});



/**
HELPER FUNCTIONS
**/

// Find Environment
function findEnvironment() {
    if (!argv.production && !argv.development) {
        return 'DEV';
    } else if (argv.production) {
        return 'PROD';
    } else if (argv.development) {
        return 'DEV';
    }
}
// Error Handling
function onError(error) {
    gutil.beep();
    log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
    this.emit('end');
}
// Bytediff Logger
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return gutil.colors.yellow(data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference);
}
var banner = gutil.template(
    '/**\n' +
    ' * <%= pkg.description %>\n' +
    ' * @version v<%= pkg.version %> - <%= today %>\n' +
    ' * @author <%= pkg.author.name %>\n' +
    ' * @copyright <%= year %>(c) <%= pkg.author.name %>\n' +
    ' * @license <%= pkg.license %>\n' +
    ' */\n', {
        file: '',
        pkg: pkg,
        today: moment(new Date()).format('D/MM/YYYY'),
        year: new Date().toISOString().substr(0, 4)
    });
