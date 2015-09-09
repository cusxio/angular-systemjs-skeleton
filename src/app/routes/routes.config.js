import 'angular-ui-router';
var routeModule = angular.module('route', ['ui.router']);


routeModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/views/home.html'
        })
}]);

export default routeModule;