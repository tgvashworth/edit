// ====================================
// keys
// ====================================

angular.module('keys', [])
.directive('keyEsc', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.addClass('mousetrap');
      Mousetrap.bind('esc', function (event, combo) {
        if( element[0] === event.target ) {
          scope.$apply(function () {
            $parse(attrs.keyEsc)(scope, {$event: event});
          });
        }
      });
    }
  };
}]);