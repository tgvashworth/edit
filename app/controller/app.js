// ====================================
// edit
// ====================================

angular.module('edit',
['edit-directive', 'edit-service', 'edit-filter', 'source', 'preview'])

// ====================================
// controller: app
// ====================================

.controller('AppController',
[        '$scope', '$location', '$filter', '$timeout', 'pubsub', 'save',
function ($scope,   $location,   $filter,   $timeout,   pubsub,   save) {
  // Keep the sketch name filtered
  $scope.sketch = '';
  $scope.update_sketch = function () {
    $timeout(function () {
      $scope.$apply(function () {
        $scope.sketch = $filter('cleanup')($scope.sketch);
      });
    });
  };

  // Manage opening & closing the info bar
  $scope.exposed = false;
  $scope.toggle = function () {
    $scope.exposed = !$scope.exposed;
  };
}]);