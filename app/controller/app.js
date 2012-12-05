// ====================================
// edit
// ====================================

angular.module('edit', [
  'edit-directive', 'edit-service', 'edit-filter',
  'source', 'preview'])

// ====================================
// controller: app
// ====================================

.controller('AppController', [
         '$scope', '$location', '$filter', 'pubsub', 'save',
function ($scope,   $location,   $filter,   pubsub,   save) {
  $scope.update = function () {};
  
  // Manage opening & closing the info bar
  $scope.exposed = false;
  $scope.toggle = function () {
    $scope.exposed = !$scope.exposed;
  };
}]);