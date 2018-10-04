account
    .service('accountEditData', function(){
      this.data;
    })
    .controller('accountController', function($scope, $http, $window, $state, $uibModal, accountEditData){
      $scope.openModal = (size) => {
        $scope.modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: '/templates/editModal.html',
          controller: 'editModalController',
          size: size,
          resolve: {
            modalData: function () {
              return $scope.modalData;
            }
          }
        }).result.catch(function(res) {
          if (!(res === 'cancel' || res === 'escape key press' || 'backdrop click')) {
            throw res;
          }
        });
      }
      
      $scope.alerts = [];
      
      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      }
      
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          $scope.currentAccount = data.data;
          console.log($scope.currentAccount);
        });
      }
      
      $scope.follow = () => {
        $http.post('/api/follow', {'following': $state.params.id}).then((data) => {
          $scope.checkAccount();
          $scope.getAccountData();
          console.log(data.data);
        });
      }
      
      $scope.getAccountData = () => {
        $http.post('/api/getAccountData', {'accountid': $state.params.id}).then((data) => {
          if(typeof data.data == 'object' && data.data.status == 401){            
            $scope.alerts.push({type: 'danger', msg: `Account doesn't exist`});            
          }else{
            accountEditData.data = data.data;
            $scope.account = data.data;
            console.log($scope.account);
          }
        });
      }
      
      $scope.logout = () => {
        $http.post('/api/logout').then((data) => {
          console.log(data.data);
          $window.location.href = '/';
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
        $scope.getAccountData();
      }
      
      $scope.init();
    })
    
    .controller('editModalController', function($scope, $http,  $window, $uibModalInstance, accountEditData){
      $scope.editAccount = accountEditData.data;
      
      $scope.closeModal = () => {
        $uibModalInstance.dismiss('cancel');
      }
      
      $scope.editAccountFunc = () => {
        console.log($scope.editAccount);
        $http.post('/api/editAccount', $scope.editAccount).then((data) => {
          $window.location.href = data.data;
          $scope.closeModal();
        });
      }
    })
    
    .controller('loginController', function($scope, $http, $window){
      
      $scope.alerts = [];
      
      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };
      
      $scope.loginUser = () => {
        $scope.loginForm.$setSubmitted();
        $http.post('/api/login', $scope.login).then((data) => {
          if(typeof data.data == 'object' && data.data.status == 401){
            $scope.alerts.push({type: 'danger', msg: 'Wrong username or password'});
          }else if(typeof data.data == 'object' && data.data.status == 402){
            console.log('user not found');
          }else{
            $window.location.href = data.data;
          }
          console.log(data);
        });
      }
      
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          $scope.currentAccount = data.data;
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
      }
      
      $scope.init();
    })
    
    .controller('signupController', function($scope, $http, $window){
      
      $scope.alerts = [];
      
      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };
      
      $scope.createUser = () => {
        if($scope.newUser.password == $scope.newUser.passConfirm){
          $scope.signUpForm.$setSubmitted();
          $http.post('/api/signup', $scope.newUser).then((data) => {
            if(typeof data.data == 'object'){
              if(data.data.code == 11000){
                $scope.alerts.push({type: 'danger', msg: 'Someone already has that username'});
              }
            }else {
              $window.location.href = data.data;
            }
            console.log(data);
          });
        } else {
          $scope.alerts.push({type: 'danger', msg: `Passwords don't match`});
        }
      }
      
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          $scope.currentAccount = data.data;
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
      }
      
      $scope.init();
    });
