swapTwoDigits = (digits) ->
  [0..digits.length - 2].map (i) ->
    parseEgn(digits[0...i] + digits[i + 1] + digits[i] + digits[i + 2..])

remove = (item, arr) ->
  copy = arr.slice()
  i = copy.indexOf(item)
  copy.splice(i, 1) if i != -1
  copy

Array::flatMap = (f) ->
  @.map(f).reduce(((acc, arr) -> acc.concat(arr)), [])

Array::unique = ->
  output = {}
  output[@[key]] = @[key] for key in [0...@length]
  value for key, value of output

permutations = (xs) ->
  if xs.length == 1
    [xs]
  else
    xs.unique().flatMap (x) ->
      permutations(remove(x, xs)).map (p) ->
        [x].concat p

combinations = (xs, n) ->
  return [[]] if n == 0
  return  []  if xs.length == 0

  [head, tail] = [xs[0], xs.slice(1)]

  combinations(tail, n - 1).map (c) ->
    [head].concat c
  .concat combinations(tail, n)

combinationsWithRepetitions = (xs, n) ->
  return [[]] if n == 0
  return  []  if xs.length == 0

  [head, tail] = [xs[0], xs.slice(1)]

  combinations(xs, n - 1).map (c) ->
    [head].concat c
  .concat combinationsWithRepetitions(tail, n)

fixWrongDigits = (n) -> (digits) ->
  digits = parseEgn digits
  changeDigit = (p, n, xs) -> xs[0...p].concat([n]).concat xs[p + 1..]
  changeDigits = (ps, ns, xs) ->
    if ps.length == 0 or ns.length == 0
      xs
    else
      changeDigits(ps.slice(1), ns.slice(1), changeDigit(ps[0], ns[0], xs))

  combinations([0..9], n).flatMap (ps) ->
    gs = ps.map (p) -> remove(digits[p], [0..9])
    if gs.length == 1
      gs[0].map (n) ->
        changeDigits(ps, [n], digits)
    else
      product(gs).map (ns) ->
        changeDigits(ps, ns, digits)

tooManyDigits = (digits) ->
  digits = parseEgn digits
  combinations([0...digits.length], digits.length - 10).map (ps) ->
    [0...digits.length].filter (i) -> not (i in ps)
    .map (i) -> digits[i]

egnPermutations = (digits) ->
  permutations(parseEgn(digits))

