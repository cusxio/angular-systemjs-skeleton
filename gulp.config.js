var config = {
    src: {
        images: 'src/assets/images/*',
        fonts: 'src/assets/fonts/**/*.*',
        sass: 'src/sass/**/*.sass',
        scripts: 'src/**/**/*.js',
        html: 'src/**/**/*.html',
    },
    tmp: {
        styles: '.tmp/styles',
        scripts: '.tmp/scripts'
    },
    dist: {
        basePath: 'dist/',
        images: 'dist/assets/images',
        fonts: 'dist/assets/fonts',
        styles: 'dist/styles'
    }
};

module.exports = config;
