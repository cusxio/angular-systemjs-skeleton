var config = {
    src: {
        basePath: 'src/',
        images: 'src/assets/images/*',
        fonts: 'src/assets/fonts/**/*.*',
        sass: 'src/sass/**/*.sass',
        scripts: 'src/**/**/**/*.js',
        html: 'src/**/**/**/*.html',
        srchtml: 'src/*.html'
    },
    tmp: {
        basePath: '.tmp/',
        styles: '.tmp/styles',
        scripts: '.tmp/app/app'
    },
    dist: {
        basePath: 'dist/',
        images: 'dist/assets/images',
        fonts: 'dist/assets/fonts',
        styles: 'dist/styles',
        scripts: 'dist/scripts'
    }
};

module.exports = config;
