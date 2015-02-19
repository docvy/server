/**
* Angular Controllers
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


angular.module('docvy.controllers', ["ngResource"])


.controller("AppCtrl", ["$scope", function($scope) { }])

.controller("BrowseCtrl", ["$scope", "$http", function($scope, $http) {
  $scope.alert = { message: "ian", _class:"", visible: false };
  $scope.content;

  // showing notifications
  function notify(_message) {
    $scope.alert.message = _message;
    $scope.alert._class = "info";
    var box = {
      danger: function() { $scope.alert._class = "danger"; return box; },
      info: function() { $scope.alert._class = "info"; return box; },
      success: function() { $scope.alert._class = "success"; return box; },
      show: function() { $scope.alert.visible = true; return box; },
      hide: function(timeout) {
        if (timeout) {
          setTimeout(function() {
            $scope.alert.visible = false;
            $scope.$apply();
          }, timeout * 1000);
        } else {
          $scope.alert.visible = false;
        }
        return box;
      }
    };
    return box;
  }

  // reading directories
  $scope.readdir = function(_dirpath) {
    notify("reading directory").show();
    var config = { };
    if (_dirpath) { config.params = { dirpath: _dirpath }; }
    $http.get("/files/", config)
      .success(function(data) {
        notify().hide();
        $scope.content = data;
        console.log(data);
      })
      .error(function(data) {
        notify("error reading directory: " + data).danger().show().hide(7);
      });
  };
  $scope.readdir(); // immediately read something

}])
