var express = require('./config/express.js'),
    config = require('./config/config.js'),
    chalk = require('chalk');

var app = express();


app.listen(config.port, function() {
    console.log(chalk.yellow('Its happening at port: ' + config.port));
});