// ====================================
// edit-service
// ====================================

angular.module('edit-service', [])

// ====================================
// service: sketch
// ====================================

.factory('sketch', [function () {
  var me = {
    prefix: 'edit:sketch:',
    load: function (sketch) {
      return localStorage.getItem(me.prefix + (sketch || 'temp')) || '';
    },
    save: function (sketch, source) {
      return localStorage.setItem(me.prefix + (sketch || 'temp'), source);
    }
  };

  return me;
}])

// ====================================
// service: pubsub
// Event pub/sub system. Super simple. pubsub.emit, pubsub.on. That's it.
// ====================================

.factory('pubsub', function () {

    var pubsub = {};

    /**
     * pubsub.subscribers is an object where each key is an event
     * and each value is an array of callback functions associated
     * with a particular event.
     */

    pubsub.subscribers = {};

    /**
     * pubsub.emit calls all the callbacks associated with a
     * particular event (the first argument), passing each callback
     * any further arguments supplied to emit.
     */

    pubsub.emit = function () {
      // arguments is not an array.
      // use `[].slice.call` to turn it into a proper one.
      // See: http://s.phuu.net/SiRS7W
      var args = [].slice.call(arguments, 0);
      
      // pull the event off the front of the array of arguments.
      var event = args.shift();
      
      // If we have no subscribers to this event, initialise it.
      // Note, we could just return here.
      if( !pubsub.subscribers[event] ) pubsub.subscribers[event] = [];
      
      // Run through all the subscriber callbacks to the event and
      // fire them using `apply`. This runs the cb with a set of
      // arguments from the args array.
      // See: http://s.phuu.net/SiSkTC
      pubsub.subscribers[event].forEach(function (cb) {
        cb.apply(this, args);
      });
    };

    /**
     * pubsub.on adds callbacks to the list associated with an event.
     */

    pubsub.on = function (event, cb) {
      // first, if this is a new event, set up a new list in the 
      // subscribers object.
      if( !pubsub.subscribers[event] ) {
        pubsub.subscribers[event] = [];
      }
      // next, push the supplied callback into the list to be 
      // called when the object is emitted
      pubsub.subscribers[event].push(cb);
    };

    return pubsub;
})

// ====================================
// service: detector
// Detects a what the programming language you're coding in. Sometimes. 
// ====================================

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
    { exp: /<!doctype/i, lang: 'html' },
    { exp: /\#\!html/i, lang: 'html' },
    { exp: /\#\!css/i, lang: 'css' },
    { exp: /\#\!javascript/i, lang: 'javascript' }
  ];

  return function (test) {
    if( typeof test !== 'string' ) throw new Error('test must be a string');

    var vote = {}, max = 0, lang = '';

    // Only use the first 5 lines
    var first_line = test.split('\n').slice(0,1).join('\n');

    var declaration = declarations.reduce(function (prev, matcher) {
      if( first_line.match(matcher.exp) ) {
        return matcher.lang;
      }
      return prev;
    }, false);

    if( declaration ) return declaration;

    // Only use the first 5 lines
    var first_5_lines = test.split('\n').slice(0,5).join('\n');

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

})


;