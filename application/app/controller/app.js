// ====================================
// edit
// ====================================

angular.module('edit',
['edit-directive', 'edit-service', 'edit-filter', 'source', 'preview'])

// ====================================
// config
// ====================================

.config(
[        '$locationProvider',
function ($locationProvider) {
  $locationProvider.html5Mode(true);
}])

// ====================================
// controller: app
// ====================================

.controller('AppController',
[        '$scope', '$location', '$filter', '$timeout', 'pubsub', 'sketch',
function ($scope,   $location,   $filter,   $timeout,   pubsub,   sketch) {
  $scope.sketch = $location.path() || '';

  pubsub.on('source:response', function (source) {
    sketch.save($scope.sketch, source);
  });

  $scope.save = function () {
    pubsub.emit('source:request');
  };

  pubsub.on('source:change', $scope.save);

  // Keep the sketch name filtered
  $scope.update_sketch = function () {
    $timeout(function () {
      $scope.$apply(function () {
        $scope.sketch = $filter('cleanup')($scope.sketch);
        // Save after a second
        if( $scope.timeout ) {
          $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.save.bind(this), 1000);
      });
    });
  };

  $scope.update_sketch_from_path = function (path) {
    $scope.sketch = $filter('cleanup')(path);
    $scope.is_saving = ($scope.sketch !== '');
    if( $scope.disable_load ) { return ($scope.disable_load = false); }
    // Request that the sketch module load a sketch
    pubsub.emit('sketch:load', sketch.load($scope.sketch));
  };

  // This is Angular playing silly buggers
  $scope.$watch(function () { return $location.path(); }, $scope.update_sketch_from_path);
  $scope.$watch('sketch', function (name) {
    $scope.disable_load = true;
    $location.path(name);
  });

  // Manage opening & closing the info bar
  $scope.exposed = false;
  $scope.toggle = function () {
    $scope.exposed = !$scope.exposed;
  };

  // Drag
  $scope.drag_over = false;
  $scope.drag = function () {
    $scope.drag_over = !$scope.drag_over;
  };
}]);