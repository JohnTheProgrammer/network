var view = angular.module('view', ['ui.router', 'ui.bootstrap']);

view.config(function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('home', {
            url: '/',
            templateUrl: '/templates/view/home.html',
            controller: 'homeController'
        })

        .state('explore', {
            url: '/explore',
            templateUrl: '/templates/view/explore.html',
            controller: 'exploreController'
        });
});
