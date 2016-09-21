getOptimalPattern = ->
  getOptimalDatePattern = ->
    [minAge, maxAge] = getAgeRange()
    minYear = moment().year() - maxAge - 1
    maxYear = moment().year() - minAge

    getCentury = (year) -> year // 100

    if getCentury(minYear) == getCentury(maxYear)
      yearsPattern = "[#{minYear %% 100}-#{maxYear %% 100}]"
      century = getCentury(maxYear)
      switch century
        when 18
          months = '[21-32]'
        when 19
          months = '[01-12]'
        when 20
          months = '[41-52]'
      return "#{yearsPattern}#{months}[1-31]"

    months = []

    if minYear < 2000 or 1900 <= maxYear
      months = months.concat [1..12]

    if minYear < 1900
      months = months.concat [21..32]

    if maxYear >= 2000
      months = months.concat [41..52]

    years = [minYear..maxYear].map((y) -> y %% 100).unique()

    if minYear - maxYear >= 99
      years = '??'
    else
      years = "[#{years.join(',')}]"

    return "#{years}[#{months.join(',')}][1-31]"

  getOptimalRegionPattern = ->
    gender = getGender()
    region = getRegion()

    if region == '?'
      switch gender
        when 'M'
          return "??[0-8,2]"
        when 'F'
          return "??[1-9,2]"
        when '?'
          return "???"

    min = regions[region].min
    max = regions[region].max

    switch gender
      when 'M'
        return "[#{min}-#{max},2]"
      when 'F'
        n = Number(min[2]) + 1
        min = min.replace(/.$/, n)
        return "[#{min}-#{max},2]"
      when '?'
        return "[#{min}-#{max}]"

  return "#{getOptimalDatePattern()}#{getOptimalRegionPattern()}?"


