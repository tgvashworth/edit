// ====================================
// Detector
// ====================================

angular.module('util', [])
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

  // If these are found on the first line they force the language
  var declarations = [
    { exp: /\#\!markdown/i, lang: 'markdown' },
    { exp: /\#\!html/i, lang: 'html' },
    { exp: /\#\!css/i, lang: 'css' },
    { exp: /\#\!javascript/i, lang: 'javascript' }
  ];

  return function (test) {
    if( typeof test !== 'string' ) throw new Error('test must be a string');

    var vote = {}, max = 0, lang = '';

    // Only use the first 5 lines
    first_line = test.split('\n').slice(0,1).join('\n');

    var declaration = declarations.reduce(function (prev, matcher) {
      if( first_line.match(matcher.exp) ) {
        return matcher.lang;
      }
      return prev;
    }, false);

    if( declaration ) return declaration;

    // Only use the first 5 lines
    first_5_lines = test.split('\n').slice(0,5).join('\n');

    regexp.forEach(function (matcher) {
      if( first_5_lines.match(matcher.exp) ) {
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