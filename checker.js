  var btn, egn, tbl;
  var digits = _.range(10);
  var regions = {
    "Благоевград"       : {"min":"000", "max":"043"},
    "Бургас"            : {"min":"044", "max":"093"},
    "Варна"             : {"min":"094", "max":"139"},
    "Велико Търново"    : {"min":"140", "max":"169"},
    "Видин"             : {"min":"170", "max":"183"},
    "Враца"             : {"min":"184", "max":"217"},
    "Габрово"           : {"min":"218", "max":"233"},
    "Кърджали"          : {"min":"234", "max":"281"},
    "Кюстендил"         : {"min":"282", "max":"301"},
    "Ловеч"             : {"min":"302", "max":"319"},
    "Монтана"           : {"min":"320", "max":"341"},
    "Пазарджик"         : {"min":"342", "max":"377"},
    "Перник"            : {"min":"378", "max":"395"},
    "Плевен"            : {"min":"396", "max":"435"},
    "Пловдив"           : {"min":"436", "max":"501"},
    "Разград"           : {"min":"502", "max":"527"},
    "Русе"              : {"min":"528", "max":"555"},
    "Силистра"          : {"min":"556", "max":"575"},
    "Сливен"            : {"min":"576", "max":"601"},
    "Смолян"            : {"min":"602", "max":"623"},
    "София - град"      : {"min":"624", "max":"721"},
    "София - окръг"     : {"min":"722", "max":"751"},
    "Стара Загора"      : {"min":"752", "max":"789"},
    "Добрич (Толбухин)" : {"min":"790", "max":"821"},
    "Търговище"         : {"min":"822", "max":"843"},
    "Хасково"           : {"min":"844", "max":"871"},
    "Шумен"             : {"min":"872", "max":"903"},
    "Ямбол"             : {"min":"904", "max":"925"},
    "Друг/Неизвестен"   : {"min":"926", "max":"999"}
  };

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

  var parseEgn = (egn) => egn.split('').map(Number);

  var egnOk = (egn) => (_.reduce(
                        _.range(9)
                          .map(i => egn[i] * (Math.pow(2, i + 1) % 11)),
                        (sum, n) => sum + n) % 11 % 10) === egn[9];

  var genderOk = (gender) => (egn) => (gender === "M") ? egn[8] % 2 === 0
                                    : (gender === "F") ? egn[8] % 2 !== 0
                                                       : true;
  var regionOk = (region) => {
    if (regions[region]) {
      var min = Number(regions[region].min),
          max = Number(regions[region].max);
      return (egn) => {
        var n = Number(_.take(_.drop(egn, 6), 3).join(''));
        return min <= n && n <= max;
      };
    }
    else
      return (egn) => true;
  };

  var dateOk = (egn) => {
    var y = 10 * egn[0] + egn[1],
        m = 10 * egn[2] + egn[3],
        d = 10 * egn[4] + egn[5];
    y += (egn[2] > 3) ? 2000 : (egn[2] > 1) ? 1800 : 1900;
    m -= (egn[2] > 3) ?   40 : (egn[2] > 1) ?   20 :    0;
    var date = moment([y, m - 1, d]);
    return date.isValid()
        && date.isBefore()
        && date.isAfter(moment().subtract(130, 'y'));
  };

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
    .filter(dateOk)
    .filter(regionOk(getRegion()));

  var findEgns = (egn) =>
    _.uniq(filterEgns(
      _.flatten(cartesian(digits, 10 - egn.length)
        .map(nums => combinations(digits, 10 - egn.length)
          .map(ps => fillAllPos(egn, nums, ps))),
      true)), false, x => x.toString());

  var findEgnsWithPattern = (egn) => {
    var ps  = _.filter(_.range(egn.length), i => egn[i] === '?');
    var egn = _.filter(egn, i => i !== '?').map(Number);
    if (egn.length + ps.length === 10)
      return _.uniq(filterEgns(cartesian(digits, ps.length)
              .map(nums => fillAllPos(egn, nums, ps)))
              , false, x => x.toString());
    else if (egn.length + ps.length <= 10)
      return _.uniq(_.flatten(cartesian(digits, ps.length)
              .map(nums => fillAllPos(egn, nums, ps))
              .map(findEgns)
              , true)
              , false, x => x.toString());
    else
      return [];
  };

  var showResults = (rs) =>
    rs.forEach(r =>
      tbl.insertRow().insertCell().textContent = r.join(""));

  var getGender = () => document.getElementById("gender").value;
  var getRegion = () => document.getElementById("region").value;

  window.onload = () => {
    btn = document.getElementById("btn");
    egn = document.getElementById("egn");
    tbl = document.getElementById("egns");

    btn.onclick = () => {
      egn.setCustomValidity("");

      if (!egn.checkValidity()) {
        egn.setCustomValidity("Моля въведете само цифри или въпросителни знаци"
                            + " (за неизвестни цифри)");
        egn.reportValidity();
        return;
      }

      tbl.tBodies[0].textContent = tbl.tHead.textContent = '';
      tbl.tBodies[0].className = 'tbody-scroll';

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

