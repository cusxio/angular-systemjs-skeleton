// vendor
import angular from 'angular';
import '../styles/normalize.css!';

//Controllers
import {navCtrl} from './controllers/nav.js';

// author
import routeModule from './routes/routes.config.js';

var app = angular.module('app', [routeModule.name]);

app.controller('navCtrl', navCtrl);

angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [app.name], {
        strictDi: true
    });
});

  

export default app;



