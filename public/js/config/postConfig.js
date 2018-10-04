var post = angular.module("post", ['ui.router', 'ui.bootstrap']);

post.config(function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/create');

    $stateProvider

        .state('post', {
            url: '/create',
            templateUrl: '/templates/post/create.html',
            controller: 'createController'
        });
});
