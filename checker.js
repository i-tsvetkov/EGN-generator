(function () {
  var btn, egn, tbl;

  var cartesian = (arr, n) => {
    if (n === 0 || n < 0)
      return [[]];
    else
      return _.flatten(
        arr.map(e => cartesian(arr, n - 1)
                    .map(lst => [e].concat(lst))),
        true);
  };

  var combinations = (lst, n) => {
    if (!n) return [[]];
    if (!lst.length) return [];

    var x  = lst[0],
        xs = lst.slice(1);

    return combinations(xs, n - 1).map(function (t) {
      return [x].concat(t);
    }).concat(combinations(xs, n));
  };

  var parseEgn = (egn) => egn.split('').map(n => Number(n));

  var egnOk = (egn) => ((egn[0] * 2  +
                         egn[1] * 4  +
                         egn[2] * 8  +
                         egn[3] * 5  +
                         egn[4] * 10 +
                         egn[5] * 9  +
                         egn[6] * 7  +
                         egn[7] * 3  +
                         egn[8] * 6) % 11 % 10) === egn[9];

  var genderOk = (gender) => (egn) => (gender === "M") ? egn[8] % 2 === 0
                                    : (gender === "F") ? egn[8] % 2 !== 0
                                                       : true;

  var digits = _.range(10);

  var fillPos = (arr, item, n) => _.take(arr, n)
                                  .concat([item])
                                  .concat(_.drop(arr, n));

  var fillAllPos = (arr, items, ns) => {
    if (_.isEmpty(items) || _.isEmpty(ns))
      return arr;
    else
      return fillAllPos(fillPos(arr, items[0], ns[0]),
                        _.tail(items),
                        _.tail(ns));
  };

  var filterEgns = (egns) =>
    egns
    .filter(genderOk(getGender()))
    .filter(egnOk)
    .filter(e => moment(_.take(e, 6).join(''), 'YYMMDD').isValid());

  var findEgns = (egn) =>
    filterEgns(
      _.flatten(cartesian(digits, 10 - egn.length)
        .map(nums => combinations(digits, 10 - egn.length)
          .map(ps => fillAllPos(egn, nums, ps))),
      true));

  var findEgnsWithPattern = (egn) => {
    var ps  = _.filter(_.range(egn.length), i => egn[i] === '?');
    var egn = _.filter(egn, i => i !== '?').map(n => Number(n));
    if (egn.length + ps.length === 10)
      return filterEgns(cartesian(digits, ps.length)
              .map(nums => fillAllPos(egn, nums, ps)));
    else
      return _.flatten(cartesian(digits, ps.length)
              .map(nums => fillAllPos(egn, nums, ps))
              .map(findEgns)
              , true);
  };

  var showResults = (rs) =>
    rs.forEach(r =>
      tbl.insertRow().insertCell().textContent = r.join(""));

  var getGender = () => document.getElementById("gender").value;

  window.onload = () => {
    btn = document.getElementById("btn");
    egn = document.getElementById("egn");
    tbl = document.getElementById("egns");
    btn.onclick = () => {
      tbl.tBodies[0].textContent = tbl.tHead.textContent = '';
      if (_.contains(egn.value, '?'))
        showResults(findEgnsWithPattern(egn.value));
      else
        showResults(findEgns(parseEgn(egn.value)));
      tbl.tHead.insertRow().insertCell().textContent = 'Намерени са '
                                                        + (tbl.rows.length - 1)
                                                          .toString()
                                                        + ' ЕГН-та';
    };
  };
})();
