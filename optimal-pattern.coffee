getOptimalPatternGenerator = ->
  [minAge, maxAge] = getAgeRange()
  minYear = moment().year() - maxAge - 1
  maxYear = moment().year() - minAge

  years = [minYear..maxYear]
  months = [1..12]

  regions = getPatternsFromRangeModel \
              getOptimalRegionPattern().replace(/\?/g, '[0-9]')

  addToMonth = (y, m) ->
    switch
      when y < 1900
        m + 20
      when y >= 2000
        m + 40
      else
        m

  getDays = (month) ->
    switch month
      when 2
        [1..29]
      when 1, 3, 5, 7, 8, 10, 12
        [1..31]
      when 4, 6, 9, 11
        [1..30]

  computeLastDigit = (e) ->
    [0...9].map (i) -> e[i] * 2 ** (i + 1) % 11
           .reduce((sum, n) -> sum + n) % 11 % 10

  currentMonth = -> moment().month() + 1

  return (->
    for y in years
      eYY = pad(y % 100, 2)
      for m in months
        if y == minYear and m < currentMonth()
          continue
        if y == maxYear and m > currentMonth()
          break
        eMM = pad(addToMonth(y, m), 2)
        for d in getDays(m)
          if y == minYear and m == currentMonth() and d <= moment().date()
            continue
          if y == maxYear and m == currentMonth() and d >  moment().date()
            break
          if m == 2 and d == 29 and y % 4 != 0
            continue
          eDD = pad(d, 2)
          for r in regions
            e = eYY + eMM + eDD + r
            e += computeLastDigit e
            yield e
    return)()

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

pad = (n, s = 2) ->
  l = n.toString().length
  '0'.repeat(s - l) + n.toString()

getOptimalPattern = ->
  getOptimalDatePattern = ->
    [minAge, maxAge] = getAgeRange()
    minYear = moment().year() - maxAge - 1
    maxYear = moment().year() - minAge

    getCentury = (year) -> year // 100

    if getCentury(minYear) == getCentury(maxYear)
      yearsPattern = "[#{pad(minYear %% 100)}-#{pad(maxYear %% 100)}]"
      century = getCentury(maxYear)
      switch century
        when 18
          months = '[21-32]'
        when 19
          months = '[01-12]'
        when 20
          months = '[41-52]'
      return "#{yearsPattern}#{months}[1-31]"

    switch
      when minYear < 1900 and 1900 <= maxYear < 2000
        yymm = "([#{minYear % 100}-99][21-32]" \
             + "|[00-#{maxYear % 100}][01-12])"
      when minYear < 1900 and 2000 <= maxYear
        yymm = "([#{minYear % 100}-99][21-32]" \
             + "|[00-99][01-12]" \
             + "|[00-#{maxYear % 100}][41-52])"
      when 1900 <= minYear < 2000 and 2000 <= maxYear
        yymm = "([#{minYear % 100}-99][01-12]" \
             + "|[00-#{maxYear % 100}][41-52])"

    return "#{yymm}[1-31]"

  return "#{getOptimalDatePattern()}#{getOptimalRegionPattern()}?"

