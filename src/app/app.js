// vendor
import angular from 'angular';
import '../styles/normalize.css!';

//Controllers
import controllers from './controllers/_index.js'

// Routes
import routes from './routes/routes.config.js';

var seedApp = angular.module('seedApp', ['seedApp.route', 'seedApp.controllers']);


angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [seedApp.name], {
        strictDi: true
    });
});

export default seedApp;
