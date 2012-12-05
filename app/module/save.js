// ====================================
// Save
// ====================================

angular.module('save', ['pubsub'])
.run(['pubsub', '$location', function (pubsub, $location) {
  var sketch_name = 'temp';

  pubsub.on('sketch:name:change', function (new_name) {
    sketch_name = new_name;
  });

  // Intercept source responses
  pubsub.on('source:change', function (source) {
    localStorage.setItem('edit:save:' + sketch_name, source);
  });

  // Listen for save requests and respond to
  pubsub.on('save:request', function () {
    pubsub.emit('save:response', localStorage.getItem('edit:save:' + sketch_name) || '');
  });
}]);