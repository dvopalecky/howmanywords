const HowManyWords = (function (arrWords) {
  const totalQuestions = 25

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
    const result = Math.floor(Math.exp(((Math.log(minUnknown) + Math.log(maxKnown)) / 2)))
    return result || 0
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
    let countQuestions = 0
    let totalWords = words.length

    function getNextQuestion () {
      if (words.filter(w => typeof w.known === 'boolean').length < totalQuestions - 1) {
        if (previousAnswer !== undefined) {
          const modifier = 1
          step = Math.max(1.15, ((step - 1) * 0.91 + 1)) * modifier
          const multiplier = previousAnswer ? step : 1 / step
          const notAskedWords = words.filter(w => typeof w.known === 'undefined')
          idx = idx * multiplier
          idx = Math.ceil((2 / (1 + Math.exp(-2 * idx / totalWords)) - 1) * totalWords) // dampening
          idx = Math.max(Math.min(
            idx,
            notAskedWords.slice(-1)[0].index - 1
          ), notAskedWords.slice(0, 1)[0].index)

          while (words[idx].known !== undefined) {
            idx = idx + (multiplier < 1 ? 1 : -1)
          }
        }
        countQuestions++
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

    function getProgress () {
      return countQuestions / totalQuestions
    }

    return {
      getProgress,
      getResults,
      getNextQuestion,
      setAnswer
    }
  }

  return {
    newGame
  }
})()
