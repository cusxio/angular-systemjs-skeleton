import 'angular-ui-router';

var app = angular.module('seedApp.route', ['ui.router']);


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/views/home.html'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'app/views/about.html',
            controller: 'aboutCtrl as about'
        })
        .state('contact', {
            url: '/contact',
            templateUrl: 'app/views/contact.html',
            controller: 'contactCtrl as contact'
        });
}]);

export default app;
