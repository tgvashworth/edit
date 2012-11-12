// ====================================
// processor
// ====================================

angular.module('processor.context', ['pubsub'])
.factory('context', function ($document, pubsub) {

  pubsub.on('processor:context:loaded', function (temp, cb) {
    temp.window = temp.elem.contentWindow;
    temp.document = temp.window.document;
    cb(temp);
  });

  return {
    create: function (cb) {
      var temp = {};
      temp.elem = document.createElement('iframe');
      temp.elem.setAttribute('style', 'display: none;');
      document.body.appendChild(temp.elem);
      // Wait till next tick
      setTimeout(pubsub.emit.bind(pubsub, 'processor:context:loaded', temp, cb), 1);
    }
  };
});

angular.module('processor.processors', ['processor.context', 'pubsub'])
.factory('javascript', function ($window, context, pubsub) {
  return function (source, cb) {
    context.create(function (temp) {
      temp.window._console = temp.window.console;
      temp.window.console = $window.console;
      try {
        temp.window.eval(source);
      } catch (e) {
        console.error(e);
      }
      cb('<pre>' + source + '</pre>');
    });
  };
});

angular.module('processor', ['processor.processors'])
.factory('processor', function (javascript) {
  return {
    javascript: javascript
  };
});