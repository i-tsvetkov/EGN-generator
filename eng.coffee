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

