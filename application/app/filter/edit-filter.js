// ====================================
// edit-filter
// ====================================

angular.module('edit-filter', [])

// ====================================
// filter: cleanup
// Strips everything but lowercase letters, numbers and '-', converting ' ' to '-'
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
})

// ====================================
// filter: bound
// ====================================

.filter('bound', function () {
  return function (str, max, min) {
    var val = parseFloat(str);
    return Math.max(Math.min(max, val), min);
  };
})

;