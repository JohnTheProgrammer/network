post
    .controller('createController', function($scope, $http, $window){
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          console.log(data.data);
          $scope.currentAccount = data.data;
          if($scope.currentAccount == ''){
            $window.location.href = '/';
          }
        });
      }
      
      $scope.newPost = () => {
        $http.post('/api/newPost', $scope.post).then((data) => {
          $window.location.href = data.data;
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
      }
      
      $scope.init();
    
    });
