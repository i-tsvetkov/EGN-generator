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

getPatternLength = (pattern) ->
  subRange = (unused, r) ->
    switch
      when /\[\d+-\d+(,\d+)?\]/.test r
        return r.match(/\[\d+-(\d+)(,\d+)?\]/)[1]
      when /\[\d+(,\d+)+\]/.test r
        return _.max(r.match(/\[(.+)\]/)[1].split(',').map(Number)).toString()
  pattern.replace(/\*/g, '').replace(/(\[.+?\])/g, subRange).length

parseRange = (range) ->
  if range.match /\[\d+(,\d+)+\]/
    ns = range.match(/\d+/g).map Number
    len = Math.max(ns...).toString().length
    ns.map (n) ->
      str = n.toString()
      '0'.repeat(len - str.length) + str
  else
    [start, end, step] = range.match(/\d+/g).map Number
    step ?= 1
    len = Math.max(start, end).toString().length
    _.range(start, end + 1, step).map (n) ->
      str = n.toString()
      '0'.repeat(len - str.length) + str

getPatternsFromRangeModel = (model) ->
  return [] if getPatternLength(model) > 10
  groups = model.match(/[\d\?]+|\[.+?\]/g).map (g) ->
    if g.match /\[.+?\]/
      parseRange g
    else
      [g]
  product(groups).map (x) -> x.join('')



