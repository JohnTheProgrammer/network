account
    .controller('accountController', function($scope, $http, $window, $state, $uibModal){
      $scope.openModal = (account) => {
        $scope.modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: '/templates/account/editModal.html',
          controller: 'editModalController',
          resolve: {
            accountData: function(){
              return account;
            }
          }
        }).result.catch(function(res) {
          $scope.checkAccount();
          $scope.getAccountData();
        });
      }
      
      $scope.alerts = [];
      
      $scope.closeAlert = (index) => {
        $scope.alerts.splice(index, 1);
      }
      
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          if(typeof data.data == 'object' && data.data.status == 401){            
                        
          }else{
            $scope.currentAccount = data.data;
            console.log($scope.currentAccount);
          }
        });
      }
      
      $scope.follow = () => {
        $http.post('/api/follow', {'following': $state.params.id}).then((data) => {
          $scope.getAccountData();
          console.log(data.data);
        });
      }
      
      $scope.viewPost = (id) => {
        $window.location.href = '/post#!/view/' + $scope.account.username + '/' + id
      }
      
      $scope.likePost = (id, owner) => {
        $http.post('/api/likePost', {'id': id, 'account': owner}).then((data) => {
          $scope.getAccountData();
          console.log(data.data);
        });
      }
      
      $scope.comment = (id, postOwner) => {
        $http.post('/api/comment', {'id': id, 'comment': $scope.commentPost, 'postOwner': postOwner}).then((data) => {
          $scope.commentPost = '';
          console.log(data.data);
          $scope.getAccountData();
        });
      }
      
      $scope.getAccountData = () => {
        $http.post('/api/getAccountData', {'accountid': $state.params.id}).then((data) => {
          if(typeof data.data == 'object' && data.data.status == 401){            
            $scope.alerts.push({type: 'danger', msg: `Account doesn't exist`});            
          }else{
            $scope.isFollowing = false;
            $scope.account = data.data;
            if($scope.currentAccount != undefined){
              $scope.currentAccount.following.forEach(function(following){
                if(following.username == $scope.account.username){
                  $scope.isFollowing = true;
                }
              });
            }
            $scope.account.posts.sort(function(a, b){
              return new Date(b.date) - new Date(a.date);
            });
            $scope.account.posts.forEach(function(post){
              post.comments.sort(function(a, b){
                return new Date(b.date) - new Date(a.date);
              });
            });
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
    
    .controller('editModalController', function($scope, $http,  $window, $uibModalInstance, accountData){
      $scope.editAccount = accountData;
      
      $scope.closeModal = () => {
        $uibModalInstance.dismiss('cancel');
      }
      
      $scope.editAccountFunc = () => {
        console.log($scope.editAccount);
        $http.post('/api/editAccount', $scope.editAccount).then((data)=>{
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
