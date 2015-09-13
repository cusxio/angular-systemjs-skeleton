var express = require('express'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    path = require('path'),
    ghost = require('ghost');
    // history = require('connect-history-api-fallback');


module.exports = function() {
    var app = express();

    ghost().then(function(ghostServer) {
        app.use('/blog', ghostServer.rootApp);
        ghostServer.start(app);
    });
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(compression());
    // app.use(history());
    app.use('/', express.static(path.join(__dirname + "/../../dist")));
    return app;
};
