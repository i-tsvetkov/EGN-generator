// Generated by CoffeeScript 1.10.0
var combinations, combinationsWithRepetitions, egnPermutations, fixWrongDigits, generateRandomPattern, generateRandomRangePattern, generateRandomStarPattern, getEgnsFromModel, getPatternLength, getPatternsFromRangeModel, getRandomEgn, getRandomNumbers, parseRange, permutations, product, remove, starPattern, swapTwoDigits, tooManyDigits, tryFixIt,
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

getEgnsFromModel = function(model) {
  var getEngs;
  getEngs = function(p) {
    if (p.match(/^[\d\?]*\?[\d\?]*$/)) {
      return findEgnsWithPattern(p);
    } else if (p.match(/^\d+$/)) {
      return findEgns(parseEgn(p));
    }
  };
  if (model.match(/^(\[.+?\]|[\d\?\*])*\*(\[.+?\]|[\d\?\*])*$/)) {
    return starPattern(model).flatMap(function(p) {
      return getEgnsFromModel(p);
    }).unique();
  } else if (model.match(/^[\d\?]*\[.+?\][\d\?]*$/)) {
    return getPatternsFromRangeModel(model).flatMap(function(p) {
      return getEngs(p);
    }).unique();
  } else {
    return getEngs(model);
  }
};

tryFixIt = function(egn, genFunc) {
  return filterEgns(genFunc(egn)).unique();
};

getRandomNumbers = function(n) {
  var j, results;
  if (n == null) {
    n = 10;
  }
  return (function() {
    results = [];
    for (var j = 1; 1 <= n ? j <= n : j >= n; 1 <= n ? j++ : j--){ results.push(j); }
    return results;
  }).apply(this).map(function() {
    return parseInt(Math.random() * 10);
  });
};

generateRandomStarPattern = function(pattern) {
  var gs, l, ns, ps, randomSum, result, s;
  if (!pattern.match(/\*/)) {
    return pattern;
  }
  l = 10 - getPatternLength(pattern);
  s = pattern.match(/\*/g).length;
  randomSum = function(n, len) {
    var x;
    if (len === 1) {
      return [n];
    } else {
      x = _.sample(_.range(n));
      return [x].concat(randomSum(n - x, len - 1));
    }
  };
  ns = getRandomNumbers(l);
  ps = randomSum(l, s);
  gs = ps.map(function(i) {
    var result;
    result = [];
    _.times(i, function() {
      return result.push(ns.shift());
    });
    return result.join('');
  });
  result = pattern;
  gs.forEach(function(g) {
    return result = result.replace('*', g);
  });
  return result;
};

generateRandomRangePattern = function(pattern) {
  var result, rs;
  if (!pattern.match(/\[.+?\]/)) {
    return pattern;
  }
  rs = pattern.match(/\[.+?\]/g).map(function(r) {
    return [r, parseRange(r)];
  });
  result = pattern;
  rs.forEach(function(it) {
    return result = result.replace(it[0], _.sample(it[1]));
  });
  return result;
};

generateRandomPattern = function(pattern) {
  var e, j, k, ns, ps, ref, ref1, results, results1;
  if (!pattern.match(/\?/)) {
    return pattern;
  }
  ps = (function() {
    results = [];
    for (var j = 0, ref = pattern.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--){ results.push(j); }
    return results;
  }).apply(this).filter(function(i) {
    return pattern[i] === '?';
  });
  e = (function() {
    results1 = [];
    for (var k = 0, ref1 = pattern.length; 0 <= ref1 ? k < ref1 : k > ref1; 0 <= ref1 ? k++ : k--){ results1.push(k); }
    return results1;
  }).apply(this).filter(function(i) {
    return pattern[i] !== '?';
  }).map(function(i) {
    return Number(pattern[i]);
  });
  ns = getRandomNumbers(ps.length);
  return fillAllPos(e, ns, ps).join('');
};

getRandomEgn = function(pattern) {
  var _genderOk, _regionOk, egn, ok;
  if (pattern == null) {
    pattern = '';
  }
  _genderOk = genderOk(getGender());
  _regionOk = regionOk(getRegion());
  ok = function(e) {
    return _genderOk(e) && egnOk(e) && dateOk(e) && _regionOk(e);
  };
  if (_.isString(pattern)) {
    if (pattern === '') {
      while (true) {
        egn = getRandomNumbers();
        if (ok(egn)) {
          return egn;
        }
      }
    } else {
      while (true) {
        egn = parseEgn(generateRandomPattern(generateRandomRangePattern(generateRandomStarPattern(pattern))));
        if (ok(egn)) {
          return egn;
        }
      }
    }
  }
  if (_.isRegExp(pattern)) {
    while (true) {
      egn = getRandomNumbers();
      if (ok(egn) && pattern.test(egn.join(''))) {
        return egn;
      }
    }
  }
};

product = function(arrays) {
  var productOfTwo;
  productOfTwo = function(xs, ys) {
    return xs.map(function(x) {
      return ys.map(function(y) {
        if (Array.isArray(x)) {
          return x.concat([y]);
        } else {
          return [x].concat([y]);
        }
      });
    }).reduce(function(acc, arr) {
      return acc.concat(arr);
    });
  };
  return arrays.reduce(productOfTwo);
};

getPatternLength = function(pattern) {
  var subRange;
  subRange = function(unused, r) {
    switch (false) {
      case !/\[\d+-\d+(,\d+)?\]/.test(r):
        return r.match(/\[\d+-(\d+)(,\d+)?\]/)[1];
      case !/\[\d+(,\d+)+\]/.test(r):
        return _.max(r.match(/\[(.+)\]/)[1].split(',').map(Number)).toString();
    }
  };
  return pattern.replace(/\*/g, '').replace(/(\[.+?\])/g, subRange).length;
};

parseRange = function(range) {
  var end, len, ns, ref, start, step;
  if (range.match(/\[\d+(,\d+)+\]/)) {
    ns = range.match(/\d+/g).map(Number);
    len = Math.max.apply(Math, ns).toString().length;
    return ns.map(function(n) {
      var str;
      str = n.toString();
      return '0'.repeat(len - str.length) + str;
    });
  } else {
    ref = range.match(/\d+/g).map(Number), start = ref[0], end = ref[1], step = ref[2];
    if (step == null) {
      step = 1;
    }
    len = Math.max(start, end).toString().length;
    return _.range(start, end + 1, step).map(function(n) {
      var str;
      str = n.toString();
      return '0'.repeat(len - str.length) + str;
    });
  }
};

getPatternsFromRangeModel = function(model) {
  var groups;
  if (getPatternLength(model) > 10) {
    return [];
  }
  groups = model.match(/[\d\?]+|\[.+?\]/g).map(function(g) {
    if (g.match(/\[.+?\]/)) {
      return parseRange(g);
    } else {
      return [g];
    }
  });
  return product(groups).map(function(x) {
    return x.join('');
  });
};

starPattern = function(pattern) {
  var fst, gs, j, l, lst, ref;
  pattern = pattern.replace(/\*{2,}/g, '*');
  l = 10 - getPatternLength(pattern);
  if (l <= 0) {
    return [];
  }
  ref = pattern.split('*'), fst = ref[0], gs = 3 <= ref.length ? slice.call(ref, 1, j = ref.length - 1) : (j = 1, []), lst = ref[j++];
  return cartesian([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], l).flatMap(function(xs) {
    var k, results;
    return combinations((function() {
      results = [];
      for (var k = 0; 0 <= l ? k <= l : k >= l; 0 <= l ? k++ : k--){ results.push(k); }
      return results;
    }).apply(this), gs.length).map(function(ps) {
      return [fst].concat(slice.call(fillAllPos(xs, gs, ps)), [lst]).join('');
    });
  });
};

swapTwoDigits = function(digits) {
  var j, ref, results;
  return (function() {
    results = [];
    for (var j = 0, ref = digits.length - 2; 0 <= ref ? j <= ref : j >= ref; 0 <= ref ? j++ : j--){ results.push(j); }
    return results;
  }).apply(this).map(function(i) {
    return parseEgn(digits.slice(0, i) + digits[i + 1] + digits[i] + digits.slice(i + 2));
  });
};

remove = function(item, arr) {
  var copy, i;
  copy = arr.slice();
  i = copy.indexOf(item);
  if (i !== -1) {
    copy.splice(i, 1);
  }
  return copy;
};

Array.prototype.flatMap = function(f) {
  return this.map(f).reduce((function(acc, arr) {
    return acc.concat(arr);
  }), []);
};

Array.prototype.unique = function() {
  var j, key, output, ref, results, value;
  output = {};
  for (key = j = 0, ref = this.length; 0 <= ref ? j < ref : j > ref; key = 0 <= ref ? ++j : --j) {
    output[this[key]] = this[key];
  }
  results = [];
  for (key in output) {
    value = output[key];
    results.push(value);
  }
  return results;
};

permutations = function(xs) {
  if (xs.length === 1) {
    return [xs];
  } else {
    return xs.unique().flatMap(function(x) {
      return permutations(remove(x, xs)).map(function(p) {
        return [x].concat(p);
      });
    });
  }
};

combinations = function(xs, n) {
  var head, ref, tail;
  if (n === 0) {
    return [[]];
  }
  if (xs.length === 0) {
    return [];
  }
  ref = [xs[0], xs.slice(1)], head = ref[0], tail = ref[1];
  return combinations(tail, n - 1).map(function(c) {
    return [head].concat(c);
  }).concat(combinations(tail, n));
};

combinationsWithRepetitions = function(xs, n) {
  var head, ref, tail;
  if (n === 0) {
    return [[]];
  }
  if (xs.length === 0) {
    return [];
  }
  ref = [xs[0], xs.slice(1)], head = ref[0], tail = ref[1];
  return combinations(xs, n - 1).map(function(c) {
    return [head].concat(c);
  }).concat(combinationsWithRepetitions(tail, n));
};

fixWrongDigits = function(n) {
  return function(digits) {
    var changeDigit, changeDigits;
    digits = parseEgn(digits);
    changeDigit = function(p, n, xs) {
      return xs.slice(0, p).concat([n]).concat(xs.slice(p + 1));
    };
    changeDigits = function(ps, ns, xs) {
      if (ps.length === 0 || ns.length === 0) {
        return xs;
      } else {
        return changeDigits(ps.slice(1), ns.slice(1), changeDigit(ps[0], ns[0], xs));
      }
    };
    return combinations([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], n).flatMap(function(ps) {
      var gs;
      gs = ps.map(function(p) {
        return remove(digits[p], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });
      if (gs.length === 1) {
        return gs[0].map(function(n) {
          return changeDigits(ps, [n], digits);
        });
      } else {
        return product(gs).map(function(ns) {
          return changeDigits(ps, ns, digits);
        });
      }
    });
  };
};

tooManyDigits = function(digits) {
  var j, ref, results;
  digits = parseEgn(digits);
  return combinations((function() {
    results = [];
    for (var j = 0, ref = digits.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--){ results.push(j); }
    return results;
  }).apply(this), digits.length - 10).map(function(ps) {
    var j, ref, results;
    return (function() {
      results = [];
      for (var j = 0, ref = digits.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this).filter(function(i) {
      return !(indexOf.call(ps, i) >= 0);
    }).map(function(i) {
      return digits[i];
    });
  });
};

egnPermutations = function(digits) {
  return permutations(parseEgn(digits));
};
