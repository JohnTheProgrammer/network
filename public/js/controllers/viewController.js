view
    .controller('homeController', function($scope, $http, $window){
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          $scope.currentAccount = data.data;
          console.log($scope.currentAccount);
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
      }
      
      $scope.init();
    })
    
    .controller('exploreController', function($scope, $http, $window){
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
    });
