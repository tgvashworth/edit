describe('edit-filter', function () {

  beforeEach(module('edit-filter'));

  it('should remove crazy characters', inject(function ($filter) {
    expect($filter('cleanup')('ab 9c---d+ef')).toBe('ab-9c-def');
  }));

  it('should handle lots of spaces', inject(function ($filter) {
    expect($filter('cleanup')('a                 b')).toBe('a-b');
  }));

  it('handle insane data', inject(function ($filter) {
    expect($filter('cleanup')(undefined)).toBe('');
    expect($filter('cleanup')({})).toBe('');
  }));

});