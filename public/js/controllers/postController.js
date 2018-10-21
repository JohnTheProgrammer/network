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
        //$scope.accountsTagged = $scope.post.body.match(/@[a-z]+/gi);
        $http.post('/api/newPost', $scope.post).then((data) => {
          $window.location.href = data.data;
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
      }
      
      $scope.init();
    
    })
    
    .controller('viewPostController', function($scope, $http, $window, $state, $uibModal){
      $scope.openModal = (post) => {
        $scope.modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: '/templates/post/editModal.html',
          controller: 'editModalController',
          resolve: {
            postData: function(){
              return post;
            }
          }
        }).result.catch(function(res) {
          $scope.getPost();
        });
      }
      
      $scope.checkAccount = () => {
        $http.post('/api/checkAccount').then((data) => {
          console.log(data.data);
          $scope.currentAccount = data.data;
        });
      }
      
      $scope.likePost = (id, owner) => {
        $http.post('/api/likePost', {'id': id, 'account': owner}).then((data) => {
          $scope.getPost();
        });
      }
      
      $scope.getPost = () => {
        $http.post('/api/getPost', {'id': $state.params.id, 'account': $state.params.account}).then((data) => {
          $scope.post = data.data;
          console.log(data.data);
        });
      }
      
      $scope.comment = (id, postOwner) => {
        $http.post('/api/comment', {'id': id, 'comment': $scope.commentPost, 'postOwner': postOwner}).then((data) => {
          $scope.commentPost = '';
          console.log(data.data);
          $scope.checkAccount();
          $scope.getPost();
        });
      }
      
      $scope.init = () => {
        $scope.checkAccount();
        $scope.getPost();
      }
      
      $scope.init();
    })
    
    .controller('editModalController', function($scope, $http, $window, $state, $uibModalInstance, postData){
      $scope.editPost = postData;
      if($scope.editPost.type == undefined){
        $scope.editPost.type = 'personal';
      }
      console.log($scope.editPost);
      
      $scope.submitEditPost = () => {
        $http.post('/api/editPost', $scope.editPost).then((data) => {
          console.log(data.data);
          $scope.closeModal();
        });
      }
      
      $scope.deletePost = () => {
        $http.post('/api/deletePost', {'account': $scope.editPost.owner, 'id': $scope.editPost._id}).then((data) => {
          $window.location.href = data.data;
        });
      }
      
      $scope.closeModal = () => {
        $uibModalInstance.dismiss('cancel');
      }
    });
