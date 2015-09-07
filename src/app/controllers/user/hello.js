gulp.task('build', (cb) => {
    runSequence(
        ['clean'],
        ['compile', 'extras', 'images', 'fonts'],
        cb
    );

});
alert('Working!');