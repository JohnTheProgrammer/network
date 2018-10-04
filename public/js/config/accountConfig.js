var account = angular.module('account', ['ui.router', 'ui.bootstrap']);

account.config(function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/login');

    $stateProvider

        .state('account', {
            url: '/:id',
            templateUrl: '/templates/account/profile.html',
            controller: 'accountController'
        })

        .state('login', {
            url:'/login',
            templateUrl: '/templates/account/login.html',
            controller: 'loginController'
        })

        .state('signup', {
            url: '/signup',
            templateUrl: '/templates/account/signup.html',
            controller: 'signupController'
        });
});
