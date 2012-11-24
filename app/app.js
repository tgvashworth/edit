// ====================================
// Edit.
// ====================================

angular.module('edit', ['source', 'preview', 'save'])
.run(function () {});

var ActionController = function ($scope, pubsub) {
  $scope.change = function () {
    $scope.sketch_name = ($scope.sketch_name || '')
                            .toLowerCase()
                            .replace(/[^a-z\s-]/g, '')
                            .replace(/\s/g, '-')
                            .trim();
  };
};