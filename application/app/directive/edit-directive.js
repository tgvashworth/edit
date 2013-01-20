// ====================================
// edit-directive
// ====================================

angular.module('edit-directive', [])

// ====================================
// directive: hasFocus
// Focuses on an input if the passed expression evaluates to true
// ====================================

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
}])

// ====================================
// directive: keyEsc
// listens for an escape key event on anything
// ====================================

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
}])

// ====================================
// directive: onDragEnter
// handles dragenter event
// ====================================

.directive('onDragEnter', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('dragenter', function (event) {
        scope.$apply(function () {
          $parse(attrs.onDragEnter)(scope, {$event: event});
        });
      });
    }
  };
}]);