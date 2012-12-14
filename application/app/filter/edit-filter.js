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
    try {
      return (str || '').toLowerCase()
                .replace(/[\s\-]+/ig, '-')
                .replace(/[^a-z0-9\-]/ig, '');
    } catch (e) {
      return '';
    }
  };
});