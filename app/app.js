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
      editor.setTheme("ace/theme/solarized_light");
      editor.getSession().setUseSoftTabs(true);
      editor.getSession().setTabSize(2);

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

// ====================================
// Detector
// ====================================

angular.module('detector', [])
.factory('detector', function () {

  // Regexps for each language. There should really be an
  // equal number for each langue to make the weighting better.
  var regexp = [
    // HTML
    { exp: /<!/i, lang: 'html' },
    { exp: /<[\s\S]*>/i, lang: 'html' },
    { exp: /doctype/i, lang: 'html' },
    { exp: /html/i, lang: 'html' },
    { exp: /title/i, lang: 'html' },
    // CSS
    { exp: /[\s\S]*\{[\s\S]*/i, lang: 'css' },
    { exp: /\{[\s\S]*:[\s\S]*\;[\s\S]*\}/i, lang: 'css' },
    { exp: /:(hover|active)/i, lang: 'css' },
    { exp: /([#|\.]{1,})([\w|:|\s|\.]+)/i, lang: 'css' },
    // JS
    { exp: /document|window|function/i, lang: 'javascript' },
    { exp: /\(function \(\)/i, lang: 'javascript' },
    { exp: /\[[\s]*[\S]+[\s\S]*\]/i, lang: 'javascript' },
    { exp: /var/i, lang: 'javascript' },
    { exp: /\=+/i, lang: 'javascript '}
  ];

  return function (test) {
    if( typeof test !== 'string' ) throw new Error('test must be a string');

    var vote = {}, max = 0, lang = '';

    // Only use the first 5 lines
    test = test.split('\n').slice(0,5).join('\n');

    regexp.forEach(function (matcher) {
      if( test.match(matcher.exp) ) {
        if( vote[matcher.lang] ) {
          vote[matcher.lang] += 1;
        } else {
          vote[matcher.lang] = 1; 
        }
      }
    });
    
    // Find the highest vote
    Object.keys(vote).forEach(function (key) {
      if( vote[key] > max ) {
        lang = key;
      }
    });
    return lang.trim();
  };

});

// ====================================
// Main
// ====================================

angular.module('edit', ['ace', 'detector']);

var PaneController = function ($scope, detector) {
  $scope.mode = 'html';
  $scope.detect = function () {
    var result = detector($scope.code);
    if( result.length > 0 ) {
      $scope.mode = result;
    }
  };
};