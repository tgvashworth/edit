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
      editor.setTheme("ace/theme/github");
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
        editor.getSession().on('change', function () {
          scope.$apply(function () {
            ngModel.$setViewValue(editor.getValue());
          });
        });
      }

    }
  };
});