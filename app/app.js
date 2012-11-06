// ====================================
// Main
// ====================================

angular.module('edit', ['ace', 'detector']);

var PaneController = function ($scope, detector) {
  $scope.mode = 'html';
  $scope.change = function () {
    var result = detector($scope.code);
    if( result.length > 0 ) {
      $scope.mode = result;
    }
  };
};