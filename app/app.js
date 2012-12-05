// ====================================
// Edit.
// ====================================

angular.module('edit', ['source', 'preview', 'save', 'focus', 'keys'])
.run(function () {})
.controller('AppController', ['$scope', 'pubsub', '$location', function ($scope, pubsub, $location) {

  $scope.$watch('$location.path()', function(path) {
    $scope.sketch_name = $location.path().slice(1) || "";
    pubsub.emit('sketch:name:change', $scope.sketch_name);
  });

  $scope.$watch('sketch_name', function(name) {
    $location.path(name);
    pubsub.emit('sketch:name:change', $scope.sketch_name);
  });

  $scope.exposed = false;

  $scope.toggle = function () {
    $scope.exposed = !$scope.exposed;
  };
}]);