// ====================================
// Save
// ====================================

angular.module('save', ['pubsub'])
.run(['pubsub', function (pubsub) {
  // Intercept source responses
  pubsub.on('pane:source:raw', function (source) {
    localStorage.setItem('edit:save:temp', source);
  });

  // Listen for save requests and respond to
  pubsub.on('save:source:request', function () {
    pubsub.emit('save:source:response', localStorage.getItem('edit:save:temp'));
  });
}]);