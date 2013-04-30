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
}])

// ====================================
// directive: draggable
// handles click & drag events for splitters
// relies on jQuery
// ====================================

.directive('draggable', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    scope: {
      'x': '='
    },
    link: function (scope, element, attrs) {
      var $this = element,
          drag = { active: false };

      var update = function (e) {
        if (!drag.active) return;

        scope.$apply(function () {
          scope.x = (e.pageX / document.width) * 100;
        });
      };

      var end = function (e) {
        drag.active = false;
        $this
          .css({
            left: (e.pageX / document.width) * 100 + '%',
            right: 'auto',
            width: '1%'
          });
      };

      $this
        .on('mousedown', function (e) {
          if (drag.active) return;
          e.preventDefault();
          drag.active = true;
          $this
            .css({
              left: 0,
              right: 0,
              width: 'auto'
            });
        })
        .on('mousemove', update)
        .on('mouseup', end);
    }
  };
}])

;