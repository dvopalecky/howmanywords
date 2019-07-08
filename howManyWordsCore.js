const HowManyWords = (function (arrWords) {
  const countQuestions = 25

  function wordsKnownEstimate (words) {
    // assuming words are sorted by frequency
    const { known, unknown } = knownAndUnknownWordsIndices(words)
    while (
      known.length > 0 &&
      unknown.length > 0 &&
      Math.max(...known) > Math.min(...unknown)
    ) {
      known.pop()
      unknown.shift()
    }
    if (unknown.length === 0) return known.slice(-1)[0] + 1
    const minUnknown = Math.min(...unknown) + 1
    const maxKnown = Math.max(...known) + 1
    // geometrical average
    return Math.floor(Math.exp(((Math.log(minUnknown) + Math.log(maxKnown)) / 2)))
  }

  function knownAndUnknownWordsIndices (words) {
    return {
      known: words.filter(w => w.known === true).map(w => w.index),
      unknown: words.filter(w => w.known === false).map(w => w.index)
    }
  }

  function newGame (arrWords) {
    let idx = Math.floor(Math.random() * 200 + 900)
    let step = 2.5
    let previousAnswer
    let words = arrWords.map((x, i) => { return { word: x, index: i } })

    function getNextQuestion () {
      if (words.filter(w => typeof w.known === 'boolean').length < countQuestions - 1) {
        if (previousAnswer !== undefined) {
          const modifier = 1
          step = Math.max(1.15, ((step - 1) * 0.91 + 1)) * modifier
          const multiplier = previousAnswer ? step : 1 / step
          const notAskedWords = words.filter(w => typeof w.known === 'undefined')
          idx = Math.max(Math.min(
            Math.ceil(idx * multiplier),
            notAskedWords.slice(-1)[0].index
          ), notAskedWords.slice(0, 1)[0].index)

          while (words[idx].known !== undefined) {
            idx = idx + (multiplier < 1 ? 1 : -1)
          }
        }
        return words[idx]
      }
    }

    function setAnswer (answer) {
      words[answer.idx] = answer
      previousAnswer = answer.known
    }

    function getResults () {
      return wordsKnownEstimate(words)
    }

    return {
      getResults,
      getNextQuestion,
      setAnswer
    }
  }

  return {
    newGame
  }
})()
