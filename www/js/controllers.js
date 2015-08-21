angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $rootScope, $ionicPopup, $timeout, $ionicScrollDelegate, $cordovaInAppBrowser) {
  var api_url = "http://rollforfun.herokuapp.com/api/";
  $scope.shake_ready = false;
  $scope.restaurants = [];
  $scope.loading = false;

  var get_restaurants = function() {
    console.log("result");
    $scope.loading = true;
    $http.get( api_url + "roll" ).success(function(result) {
      console.log(result);
      $scope.loading = false;
      $scope.restaurants = result.businesses;
    });
  };

  $scope.showAlert = function(title, msg) {
   var alertPopup = $ionicPopup.alert({
     title: title,
     template: msg
   });
  };
  var onShake = function () {
    $rootScope.shake.stopWatch();
    $scope.shake_ready = false;
    get_restaurants();
  };

  var onError = function () {
    $scope.showAlert("WTF!","");
  };
  $scope.start = function () {
    $ionicScrollDelegate.scrollTop();
    $scope.restaurants = [];
    try {
      $rootScope.shake.startWatch(onShake, 20, onError);
      $scope.shake_ready = true;
    }
    catch(err) {
      //$timeout($scope.retry, 200);
      $scope.showAlert("WTF","shake is not avaliable on this divice");
    }
  };
  $scope.retry = function () {
    $scope.restaurants = [];
    try {
      $rootScope.shake.startWatch(onShake, 20, onError);
      $scope.shake_ready = true;
    }
    catch(err) {
      $timeout($scope.start, 200);
    }
  };

  $scope.open_url = function(url) {
    $cordovaInAppBrowser.open(url, '_blank');
  };

  $timeout($scope.start, 400);
  $scope.desktop = function(){
    $scope.shake_ready = false;
    get_restaurants();
  };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
