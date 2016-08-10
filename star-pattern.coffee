starPattern = (pattern) ->
  pattern = pattern.replace(/\*{2,}/g, '*')
  l = 10 - pattern.replace(/\*/g, '').replace(/\[\d+-(\d+)\]/g, "$1").length
  [fst, gs..., lst] = pattern.split('*')
  cartesian([0..9], l).flatMap (xs) ->
    combinations([0..l], gs.length).map (ps) ->
      [fst, fillAllPos(xs, gs, ps)..., lst].join('')
