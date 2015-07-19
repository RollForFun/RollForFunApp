angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  var onShake = function () {
    alert("Oh yeah");
    $(".list").show();
    window.cordova.plugins.shake.stopWatch();
  };

  var onError = function () {
    alert("WTF");
  };
  if (cordova) {
    //alert("yes");
  }
  else{
    alert("WTF,No cordova?");
  }
  
  try {
    window.cordova.plugins.shake.startWatch(onShake, 40, onError);
    alert("shake start!");
  }
  catch(err) {
    document.getElementById("demo").innerHTML = err.message;
  }
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
