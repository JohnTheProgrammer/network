var communication = angular.module('communication', ['ui.router', 'ui.bootstrap']);

communication.config(function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/notifications');

    $stateProvider

        .state('inbox', {
            url: '/inbox',
            templateUrl: '/templates/communication/inbox.html',
            controller: 'inboxController'
        })

        .state('message', {
            url:'/message/:id',
            templateUrl: '/templates/communication/message.html',
            controller: 'messageController'
        })

        .state('notifications', {
            url: '/notifications',
            templateUrl: '/templates/communication/notifications.html',
            controller: 'notificationsController'
        });
});
