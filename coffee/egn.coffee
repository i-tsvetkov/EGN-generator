getEgnsFromModel = (model) ->
  getEgns = (p) ->
    if p.match /^[\d\?]*\?[\d\?]*$/
      findEgnsWithPattern p
    else if p.match /^\d+$/
      findEgns parseEgn p
  if model.match /\([^()]+?\)/
    getOrPatterns(model).flatMap (p) ->
      getEgnsFromModel p
  else if model.match /^(\[.+?\]|[\d\?\*])*\*(\[.+?\]|[\d\?\*])*$/
    starPattern(model).flatMap (p) ->
      getEgnsFromModel p
    .unique()
  else if model.match /^[\d\?]*\[.+?\][\d\?]*$/
    getPatternsFromRangeModel(model).flatMap (p) ->
      getEgns p
    .unique()
  else
    getEgns model

tryFixIt = (egn, genFunc) ->
  filterEgns(genFunc(egn)).unique()

numberOfEgns = (nYears) ->
  nYears * 365 * 1000 + (nYears // 4) * 1 * 1000

getRandomNumbers = (n = 10) ->
  [1..n].map -> parseInt(Math.random() * 10)

generateRandomOrPattern = (pattern) ->
  _.sample(getOrPatterns(pattern))

generateRandomStarPattern = (pattern) ->
  return pattern unless pattern.match(/\*/)
  l = 10 - getPatternLength(pattern)
  s = pattern.match(/\*/g).length
  randomSum = (n, len) ->
    if len == 1
      [n]
    else
      x = _.sample(_.range(n))
      [x].concat randomSum(n - x, len - 1)
  ns = getRandomNumbers(l)
  ps = randomSum(l, s)
  gs = ps.map (i) ->
    result = []
    _.times i, -> result.push ns.shift()
    result.join('')
  result = pattern
  gs.forEach (g) ->
    result = result.replace('*', g)
  result

generateRandomRangePattern = (pattern) ->
  return pattern unless pattern.match(/\[.+?\]/)
  rs = pattern.match(/\[.+?\]/g).map (r) -> [r, parseRange r]
  result = pattern
  rs.forEach (it) ->
    result = result.replace(it[0], _.sample(it[1]))
  result

generateRandomPattern = (pattern) ->
  return pattern unless pattern.match(/\?/)
  ps = [0 ... pattern.length].filter (i) -> pattern[i] == '?'
  e  = [0 ... pattern.length].filter (i) -> pattern[i] != '?'
                             .map (i) -> Number(pattern[i])
  ns  = getRandomNumbers(ps.length)
  fillAllPos(e, ns, ps).join('')

getRandomEgn = (pattern = '') ->
  _genderOk = genderOk(getGender())
  _regionOk = regionOk(getRegion())
  _dateOk = dateOk(ageOk(getAgeRange()))
  ok = (e) -> _genderOk(e)    \
              and egnOk(e)    \
              and _dateOk(e)  \
              and _regionOk(e)
  if _.isString(pattern)
    if (pattern == '')
      loop
        egn = getRandomNumbers()
        return egn if ok(egn)
    else
      loop
        egn = parseEgn generateRandomPattern \
                       generateRandomRangePattern \
                       generateRandomStarPattern \
                       generateRandomOrPattern pattern
        return egn if ok(egn)

  if _.isRegExp(pattern)
    loop
      egn = getRandomNumbers()
      return egn if ok(egn) and pattern.test(egn.join(''))

