let words = {}
let game
let question
let language

function hideWindows () {
  ['#initial', '#gameplay', '#results'].forEach(id => {
    document.querySelector(id).style.display = 'none'
  })
}

function loadWordsAndStartGame () {
  language = document.querySelector('#language').value
  if (words[language]) {
    startGame()
  } else {
    Papa.parse(`/${language.toLowerCase()}-lowercase-only.csv`, {
      download: true,
      complete: function (results) {
        words[language] = results.data
        startGame()
      }
    })
  }
}

function restartGame () {
  hideWindows()
  document.querySelector('#initial').style.display = 'block'
}

function startGame () {
  hideWindows()
  document.querySelector('#gameplay').style.display = 'block'
  game = HowManyWords.newGame(words[language])
  displayNextQuestion()
}

function displayNextQuestion () {
  question = game.getNextQuestion()
  if (question === undefined) {
    gameOver()
  } else {
    document.querySelector('#current-word').textContent = question.word
  }
}

function pressAnswerButton (answer) {
  question.known = answer
  game.setAnswer(question)
  displayNextQuestion()
}

function gameOver () {
  hideWindows()
  document.querySelector('#results').style.display = 'block'
  document.querySelector('#known-words-count').textContent = game.getResults()
}