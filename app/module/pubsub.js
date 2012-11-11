// ====================================
// pubsub
// ====================================

angular.module('pubsub', [])
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
});