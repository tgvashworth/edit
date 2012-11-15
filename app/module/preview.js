// ====================================
// Preview
// ====================================

angular.module('preview', ['util', 'pubsub'])
.controller('PreviewController', function ($scope, pubsub) {
  $scope.root = document.querySelector('.preview');

  // Listen out for updated source, and prepare a fresh frame
  pubsub.on('pane:source:change', function (source) {
    var fresh = {};
    fresh.elem = document.createElement('iframe');
    fresh.elem.setAttribute('frameborder', '0');
    $scope.root.prependChild(fresh.elem);
    // Wait till next tick
    setTimeout(pubsub.emit.bind(pubsub, 'pane:fresh:ready', source), 1);
    $scope.fresh = fresh;
  });

  pubsub.on('pane:fresh:ready', function (source) {
    var fresh = $scope.fresh;
    try {
      fresh.window = fresh.elem.contentWindow;
      fresh.document = fresh.window.document;
      fresh.document.open();
      fresh.document.write(source);
      fresh.document.close();
      pubsub.emit('pane:fresh:done');

    } catch(e) {
      console.log(e);
    }
  });

  // Swap out the elements & call for the stale element to be removed
  pubsub.on('pane:fresh:done', function () {
    if( $scope.active ) {
      $scope.stale = $scope.active;
      pubsub.emit('pane:stale:remove');
    }
    $scope.active = $scope.fresh;
    $scope.active.elem.classList.add('active');
  });

  // Remove the active class, and remove it next tick
  pubsub.on('pane:stale:remove', function () {
    if( ! $scope.stale ) return;
    $scope.stale.elem.classList.remove('active');
    setTimeout($scope.root.removeChild.bind($scope.root, $scope.stale.elem), 200);
  });
});
