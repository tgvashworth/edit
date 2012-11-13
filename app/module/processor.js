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

angular.module('processor.processors', ['processor.context', 'template'])
.factory('javascript', function ($window, context, template) {
  return function (source, cb) {
    context.create(function (temp) {
      var rendered_source = source;

      // Overwrite the consoles in the new context to redirect logs
      temp.window._console = temp.window.console;
      temp.window.console = $window.console;

      // Render source to template
      try {
        rendered_source = template.render(template.of.javascript, {
          source: rendered_source
        });
      } catch (e) {
        console.log(e);
      }

      // Attempt to run the rendered source in the new context
      try {
        temp.window.eval(rendered_source);
      } catch (e) {
        console.error(e);
      }

      // Send the (original) source back, post run
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