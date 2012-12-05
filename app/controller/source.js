// ====================================
// source
// ====================================

angular.module('source', ['edit-service', 'ace'])

// ====================================
// controller: source
// ====================================

.controller('SourceController', function ($scope, pubsub) {
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
      clearTimeout($scope.timeout);
    }
    $scope.timeout = setTimeout($scope.ready.bind(this), 200);
  };

  // Respond to requests for source code
  pubsub.on('source:request', function () {
    pubsub.emit('source:response', $scope.source);
  });

  // Update source code when we get a resonse from the save module
  pubsub.on('load:response', function (source) {
    $scope.source = source;
    $scope.change();
  });

  pubsub.emit('load:request');
});