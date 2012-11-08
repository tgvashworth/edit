// ====================================
// Ace
// ====================================

angular.module('ace', [])
.directive('ace', function ($window) {
  return {
    restrict: 'E',
    template: '<div class="ace-editor"></div>',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {
      if( !$window.ace ) throw new Error("ace not found.");

      // Setup Ace
      var editor = ace.edit(element.children()[0]);
      editor.setTheme("ace/theme/merbivore");
      editor.getSession().setUseSoftTabs(true);
      editor.getSession().setTabSize(2);
      editor.setShowPrintMargin(false);

      // Angular stuff
      scope.editor = editor;
      // Watch 'mode' and update the highlighting
      attrs.$observe('mode', function (newMode) {
        editor.getSession().setMode("ace/mode/" + newMode);
      });
      // If a model is set on the element, update it's value
      // when Ace reports a change
      if( ngModel ) {
        (function () {
          // Prevent the view from being updated again when we update it
          var updating = false;
          editor.getSession().on('change', function () {
            if( updating ) { updating = false; return; }
            scope.$apply(function () {
              ngModel.$setViewValue(editor.getValue());
            });
          });
          ngModel.$render = function() {
            updating = true;
            editor.getSession().setValue(ngModel.$viewValue || '');
          };
        }());
      }

    }
  };
});