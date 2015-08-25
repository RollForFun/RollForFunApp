angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, Auth, $state, $window) {
  $scope.user = {};
  $scope.errors = {};

  $scope.login = function(form) {
    $scope.submitted = true;

    if (form.$valid) {
      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then(function() {
        console.log("login success")
        // Logged in, redirect to home
        $state.go('tab.account');
      })
      .catch(function(err) {
        $scope.errors.other = err.message;
      });
    }
  };

  $scope.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };
})

.controller('DashCtrl', function($scope, $http, $rootScope, ApiUrl, $ionicPopup, $timeout, $ionicScrollDelegate, $cordovaGeolocation, $cordovaInAppBrowser) {
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
      $http.get( ApiUrl.get() + "/api/yelp/search?location=Waterloo" ).success(function(result) {
        $scope.loading = false;
        $scope.restaurants = result.businesses;
      });
    }
    else {
      $http.get( ApiUrl.get() + "/api/yelp/search?ll=" + $scope.latitude + "," + $scope.longitude).success(function(result) {
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

.controller('AccountCtrl', function($scope, $state, Auth) {
  $scope.getCurrentUser = Auth.getCurrentUser;
});
