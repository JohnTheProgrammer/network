communication
    .controller('inboxController', function($scope, $http, $window){
      $scope.dmSearch = () => {
        $window.location.href = '/communication#!/message/' + $scope.searchUser
      }
      
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          console.log(data.data);
          $scope.currentAccount = data.data;
          console.log($scope.currentAccount);
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
      }
      
      $scope.init();
    })
    
    .controller('messageController', function($scope, $http, $window, $state){
      var socket = io();
      $scope.messaging = $state.params.id;
      
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          $scope.currentAccount = data.data;
          console.log($scope.currentAccount);
        });
      }
      
      $scope.sendMessage = () => {
        $http.post('/api/message', {'message': $scope.message, 'to': $state.params.id}).then((data) => {
          console.log(data.data);
          $scope.message = '';
          $scope.getMessages();
          socket.emit('chat message', {to: $state.params.id});
        });
      }
      
      socket.on('receive message', function(data){
        console.log(data.to);
        if(data.to == $scope.currentAccount.username){
          $scope.getMessages();
        }
      });
      
      $scope.getMessages = () => {
        $http.post('/api/getMessages', {'messaging': $state.params.id}).then((data) => {  
          $scope.messages = data.data;
          console.log($scope.messages);
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
        $scope.getMessages();
      }
      
      $scope.init();
    })
    
    .controller('notificationsController', function($scope, $http, $window){
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          $scope.currentAccount = data.data;
          console.log($scope.currentAccount);
        });
      }
      
      $scope.getNotifications = () =>{
        $http.post('/api/getNotification').then((data) => {      
          $scope.notifications = data.data;
          //$scope.notifications = ['one', 'two', 'three', 'four'];
          console.log($scope.notifications);
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
        $scope.getNotifications();
      }
      
      $scope.init();
    });
