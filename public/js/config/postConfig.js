var post = angular.module("post", ['ui.router', 'ui.bootstrap']);

post.config(function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/create');

    $stateProvider

        .state('create', {
            url: '/create',
            templateUrl: '/templates/post/create.html',
            controller: 'createController'
        })
        
        .state('view', {
          url: '/view/:account/:id',
          templateUrl: '/templates/post/view.html',
          controller: 'viewPostController'
        });
});
