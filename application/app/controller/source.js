// ====================================
// source
// ====================================

angular.module('source', ['edit-service', 'ace'])

// ====================================
// controller: source
// ====================================

.controller('SourceController',
[        '$scope', 'pubsub', '$timeout',
function ($scope,   pubsub,   $timeout) {
  $scope.timeout = null;
  $scope.mode = 'html';
  $scope.source = '';

  // When the source has changed (after a sufficient wait), emit it
  $scope.ready = function () {
    pubsub.emit('source:change', $scope.source);
  };

  // Let the system know if the source changes
  $scope.change = function () {
    if( $scope.timeout ) {
      $timeout.cancel($scope.timeout);
    }
    $scope.timeout = $timeout($scope.ready.bind(this), 200);
  };

  // Respond to requests for source code
  pubsub.on('source:request', function () {
    pubsub.emit('source:response', $scope.source);
  });

  // Update source code when we we're told to a load has happened
  pubsub.on('sketch:load', function (source) {
    $scope.source = source;
    $scope.change();
  });
}]);