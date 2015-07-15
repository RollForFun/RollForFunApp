angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  var onShake = function () {
    $(".list").show();
    shake.stopWatch();
  };

  var onError = function () {
    // Fired when there is an accelerometer error (optional)
  };

  // Start watching for shake gestures and call "onShake"
  // with a shake sensitivity of 40 (optional, default 30)
  shake.startWatch(onShake, 40 /*, onError */);

  // Stop watching for shake gestures
  
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
