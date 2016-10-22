getOrPatterns = (pattern) ->
  orGroup = pattern.match /\([^()]+?\)/
  return pattern unless orGroup
  subGroups = orGroup[0].replace(/^\(|\)$/g, '').split '|'
  newPatterns = subGroups.map (g) -> pattern.replace(orGroup, g)
  newPatterns.flatMap getOrPatterns
