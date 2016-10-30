starPattern = (pattern) ->
  pattern = pattern.replace(/\*{2,}/g, '*')
  l = 10 - getPatternLength(pattern)
  return [] if l <= 0
  [fst, gs..., lst] = pattern.split('*')
  cartesian([0..9], l).flatMap (xs) ->
    combinations([0..l], gs.length).map (ps) ->
      [fst, fillAllPos(xs, gs, ps)..., lst].join('')
