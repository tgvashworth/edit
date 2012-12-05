// ====================================
// edit-filter
// ====================================

angular.module('edit-filter', [])

// ====================================
// filter: cleanup
// Strips everything but lowercase letters and '-', converting ' ' to '-'
// ====================================

.filter('cleanup', function () {
  return function (str) {
    return (str || '').toLowerCase()
              .replace(/[\s\-]+/ig, '-')
              .replace(/[^a-z\-]/ig, '');
  };
});