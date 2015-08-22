angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $rootScope, $ionicPopup, $timeout, $ionicScrollDelegate, $cordovaGeolocation, $cordovaInAppBrowser) {
  var api_url = "http://rollforfun.herokuapp.com/api/";
  $scope.shake_ready = false;
  $scope.restaurants = [];
  $scope.loading = false;
  $scope.latitude = "";
  $scope.longitude = "";

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.latitude = position.coords.latitude
      $scope.longitude = position.coords.longitude
    }, function(err) {
      $scope.showAlert("WTF","didn't get the location?");
    });

  var get_restaurants = function() {
    console.log("result");
    $scope.loading = true;
    if ($scope.latitude === "" || $scope.longitude === "") {
      $http.get( api_url + "roll" ).success(function(result) {
        console.log(result);
        $scope.loading = false;
        $scope.restaurants = result.businesses;
      });
    }
    else {
      $http.get(api_url + "rollbyll/" + $scope.latitude + "/" + $scope.longitude).success(function(result) {
        console.log(result);
        $scope.loading = false;
        $scope.restaurants = result.businesses;
      });
    }
    
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
    $scope.showAlert("WTF","shaking error?");
  };
  $scope.start = function () {
    $ionicScrollDelegate.scrollTop();
    $scope.restaurants = [];
    try {
      $rootScope.shake.startWatch(onShake, 20, onError);
      $scope.shake_ready = true;
    }
    catch(err) {
      $scope.showAlert("WTF","shake is not working?");
    }
  };

  $scope.open_url = function(url) {
    $cordovaInAppBrowser.open(url, '_blank');
  };

  $timeout(function() {
      if (typeof $rootScope.shake_hw_ready === "undefined") {
        $scope.showAlert("WTF","shake is not available on your device?");
      }
    }, 5000);
  $scope.desktop = function() {
    $scope.shake_ready = false;
    get_restaurants();
  };

  var shakeWatch = $scope.$watch(function() {
    return $rootScope.shake_hw_ready;
  },
    function(newValue, oldValue) {
      if (newValue === true) {
        $scope.start();
        shakeWatch();
      }
  });
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
