product = (arrays) ->
  productOfTwo = (xs, ys) ->
    xs.map (x) ->
      ys.map (y) ->
        if Array.isArray x
          x.concat [y]
        else
          [x].concat [y]
    .reduce (acc, arr) -> acc.concat arr

  arrays.reduce productOfTwo

parseRange = (range) ->
  [start, end] = range.match(/\d+/g).map (n) -> Number(n)
  len = Math.max(start, end).toString().length
  [start..end].map (n) ->
    str = n.toString()
    '0'.repeat(len - str.length) + str

getPatternsFromRangeModel = (model) ->
  return [] if model.replace(/\[\d+-(\d+)\]/g, "$1").length > 10
  groups = model.match(/[\d\?]+|\[\d+-\d+\]/g).map (g) ->
    if g.match /\[\d+-\d+\]/
      parseRange g
    else
      [g]
  product(groups).map (x) -> x.join('')



