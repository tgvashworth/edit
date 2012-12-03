// ====================================
// hasfocus
// ====================================

angular.module('focus', [])
.directive('hasFocus', [function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(attrs.hasFocus, function (hasFocus) {
        if( hasFocus ) {
          element.focus();
        }
      });
    }
  };
}]);