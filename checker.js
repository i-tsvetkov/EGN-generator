(function () {
  var btn, egn, tbl;
  var egnOk = (egn) => ((egn[0] * 2 +
                         egn[1] * 4 +
                         egn[2] * 8 +
                         egn[3] * 5 +
                         egn[4] * 10 +
                         egn[5] * 9 +
                         egn[6] * 7 +
                         egn[7] * 3 +
                         egn[8] * 6) % 11 % 10) === egn[9];
  var digits = _.range(10);
  var fillPos = (arr, item, n) => _.take(arr, n).concat([item]).concat(_.drop(arr, n));
  var findEgns = (egn) =>
    _.flatten(
      _.range(egn.length).map(
        pos => digits.map(
          d => fillPos(egn, d, pos)
        )
      ),
      true
    ).filter(egnOk).filter(e => moment(_.take(e, 6).join(''), 'YYMMDD').isValid());
  var parseEgn = (egn) => egn.split('').map(n => Number(n));
  var showResults = (rs) => rs.forEach(r => tbl.insertRow().insertCell().textContent = r.join(""));
  window.onload = () => {
    btn = document.getElementById("btn");
    egn = document.getElementById("egn");
    tbl = document.getElementById("egns");
    btn.onclick = () => { 
      tbl.textContent = '';
      showResults(findEgns(parseEgn(egn.value)));
    };
  };
})();
