// ====================================
// Save
// ====================================

angular.module('save', ['pubsub'])
.run(['pubsub', function (pubsub) {
  var sketch_name = 'temp';

  // Intercept source responses
  pubsub.on('source:change', function (source) {
    localStorage.setItem('edit:save:' + sketch_name, source);
  });

  // Listen for save requests and respond to
  pubsub.on('save:request', function () {
    pubsub.emit('save:response', localStorage.getItem('edit:save:' + sketch_name) || '');
  });
}]);