getEgnsFromModel = (model) ->
  getEngs = (p) ->
    if p.match /^[\d\?]*\?[\d\?]*$/
      findEgnsWithPattern p
    else if p.match /^\d+$/
      findEgns parseEgn p
  if model.match /^(\[\d+-\d+\]|[\d\?\*])*\*(\[\d+-\d+\]|[\d\?\*])*$/
    starPattern(model).flatMap (p) ->
      getEgnsFromModel p
    .unique()
  else if model.match /^[\d\?]*\[\d+-\d+\][\d\?]*$/
    getPatternsFromRangeModel(model).flatMap (p) ->
      getEngs p
    .unique()
  else
    getEngs model

tryFixIt = (egn, genFunc) ->
  filterEgns(genFunc(egn)).unique()

getRandomNumbers = (n = 10) ->
  [1..n].map -> parseInt(Math.random() * 10)

getRandomEgn = (pattern = '') ->
  _genderOk = genderOk(getGender())
  _regionOk = regionOk(getRegion())
  ok = (e) -> _genderOk(e)    \
              and egnOk(e)    \
              and dateOk(e)   \
              and _regionOk(e)
  if _.isString(pattern)
    if (pattern == '')
      loop
        egn = getRandomNumbers()
        return egn if ok(egn)
    else
      ps = [0 ... pattern.length].filter (i) -> pattern[i] == '?'
      e = [0 ... pattern.length].filter (i) -> pattern[i] != '?'
                                .map (i) -> Number(pattern[i])
      loop
        ns = getRandomNumbers(ps.length)
        egn = fillAllPos(e, ns, ps)
        return egn if ok(egn)
  if _.isRegExp(pattern)
    loop
      egn = getRandomNumbers()
      return egn if ok(egn) and pattern.test(egn.join(''))

