// ====================================
// ace
// ====================================

angular.module('ace', [])

// ====================================
// directive: ace
// Manages an instance of the ace editor. Use the <ace></ace> element!
// ====================================

.directive('ace', ['$window', '$rootScope', function ($window, $rootScope) {
  return {
    restrict: 'E',
    template: '<div class="ace-editor"></div>',
    scope: {
      onEsc: '&',
      onChange: '&',
      mode: '=mode',
      source: '=source',
      hasFocus: '='
    },
    link: function (scope, element, attrs, ngModel) {
      if( !$window.ace ) throw new Error("ace not found.");

      // Setup Ace
      var editor = ace.edit(element.children()[0]);
      editor.setTheme("ace/theme/merbivore");
      editor.getSession().setUseSoftTabs(true);
      editor.getSession().setTabSize(2);
      editor.setShowPrintMargin(false);

      // Listen for some events

      if( attrs.onEsc ) {
        var command = {
          name: "escape",
          bindKey: "Esc",
          exec: function () {
            scope.$apply(function () {
              scope.onEsc();
            });
          }
        };
        editor.commands.addCommand(command);
      }

      if( attrs.hasFocus ) {
        scope.$watch('hasFocus', function (hasFocus) {
          if( hasFocus ) {
            editor.focus();
          }
        });
      }

      // Angularize

      // Watch 'mode' and update the mode
      scope.$watch('mode', function (newMode) {
        editor.getSession().setMode("ace/mode/" + newMode);
      });

      (function () {
        var updating = false;
        // If a model is set on the element, update its value
        // when Ace reports a change
        editor.getSession().on('change', function () {
          if( $rootScope.$$phase || updating ) { return (updating = false); }
          scope.$apply(function () {
            updating = true;
            scope.source = editor.getSession().getValue();
            scope.onChange();
          });
        });
        scope.$watch('source', function(source) {
          if( updating ) { return (updating = false); }
          updating = true;
          editor.getSession().setValue(source || '');
        });
      }());

    }
  };
}]);