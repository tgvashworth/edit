// ====================================
// Edit.
// ====================================

angular.module('edit', ['source', 'preview', 'save', 'focus', 'keys'])
.run(function () {})
.controller('AppController', ['$scope', 'pubsub', function ($scope, pubsub) {
  $scope.exposed = false;
  $scope.toggle = function () {
    $scope.exposed = !$scope.exposed;
  };
}]);