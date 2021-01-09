function setUpGame() {
  const width = 4
  const gridCellCount = width * width
  const grid = document.querySelector('.grid')
  const cells = []
  const startingCell1 = Math.floor(Math.random() * gridCellCount)
  const startingCell2 = generateSecond()
  let gameInPlay = true
  const popUp = document.querySelector('#popup')
  
  // Can I find a cooler way of generating two random numbers?
  function generateSecond() {
    let s = Math.floor(Math.random() * (gridCellCount - 1))
    if (s >= startingCell1) s += 1
    return s
  }
  const cellTracker = {}
  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    if (i === startingCell1 || i === startingCell2) {
      cell.classList.add('two')
      cellTracker[i] = 2
    } else {
      cellTracker[i] = null
    }
    grid.appendChild(cell)
    cells.push(cell)
  }
  const dict = {
    2: 'two',
    4: 'four',
    8: 'eight',
    16: 'sixteen',
    32: 'thirtytwo',
    64: 'sixtyfour',
    128: 'onetwoeight',
    256: 'twofivesix',
    512: 'fiveonetwo',
    1024: 'tentwentyfour',
    2048: 'twozerofoureight'
  }

  function getRows() {
    const rows = []
    for (let i = 0; i < width; i++) {
      const v = Object.values(cellTracker)
      rows.push([v[i * width], v[i * width + 1], v[i * width + 2], v[i * width + 3]])
    }
    return rows
  }

  function getCols() {
    const cols = []
    for (let i = 0; i < width; i++) {
      const v = Object.values(cellTracker)
      cols.push([v[i], v[i + width], v[i + width * 2], v[i + width * 3]])
    }
    return cols
  }

  function combine(arr, dir) {
    return dir === 'left' ? combineRow(arr) : combineRow(arr.reverse()).reverse()
    function combineRow(array) {
      const arr = array
      const combinedRow = []
      while (arr.length >= 2) {
        if (arr[0] === arr[1]) {
          combinedRow.push(arr[0] + arr[1])
          arr.shift()
          arr.shift()
        } else {
          combinedRow.push(arr[0])
          arr.shift()
        }
      }
      if (arr.length === 1) {
        combinedRow.push(arr[0])
        arr.shift()
        return combinedRow
      }
      if (arr.length === 0) {
        return combinedRow
      }
    }
  }

  function populate(arrays, dir) {
    return arrays.map(arr => {
      const values = combine(arr.filter(cell => !!cell), dir) //right for right and down
      const empty = []
      for (let i = 0; i < width - values.length; i++) {
        empty.push(null)
      }
      // the other way around for left and up
      return dir === 'right' ? empty.concat(values) : values.concat(empty)
    })
  }

  function addNew() {
    const emptyCells = Object.entries(cellTracker).filter(arr => arr[1] === null)
    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    return cell
  }

  function updateCellTracker(arr) {
    arr.forEach((e, i) => {
      cellTracker[i] = e
    })
    return
  }

  function updateBoard() {
    Object.entries(cellTracker).forEach(arr => {
      cells[parseInt(arr[0])].classList.remove('two', 'four', 'eight', 'sixteen', 'thirtytwo', 'sixtyfour', 'onetwoeight', 'twofivesix', 'fiveonetwo', 'tentwentyfour', 'twozerofoureight')
      if (Object.keys(dict).includes(String(arr[1]))) {
        cells[parseInt(arr[0])].classList.add(String(dict[arr[1]]))
      }
    })
  }

  function updateGame(flatArr) {
    updateCellTracker(flatArr)
    const newTile = addNew()
    flatArr[parseInt(newTile[0])] = 2
    updateCellTracker(flatArr)
    updateBoard()
    checkWinLose()
  }

  function checkWinLose() {
    if (Object.values(cellTracker).includes(2048)) {
      confetti.start()
      gameInPlay = false
      popUp.style.visibility = 'visible'
      popUp.innerHTML = '<h4>You win!</h4><p>You found the 2048 tile</p><button id="playAgain">Play again?</button>'
      const playAgain = document.getElementById('playAgain')
      playAgain.addEventListener('click', () => window.location.reload(true))
      setTimeout(() => {
        confetti.stop()
      }, 2000)
    }
    if (!Object.values(cellTracker).includes(null)) {
      gameInPlay = false
      popUp.style.visibility = 'visible'
      popUp.innerHTML = '<h4>You lose!</h4><p>You ran out of space.</p><button id="playAgain">Play again?</button>'
      const playAgain = document.getElementById('playAgain')
      playAgain.addEventListener('click', () => window.location.reload(true))
    }
  }

  document.addEventListener('keydown', (event) => {
    if (gameInPlay) {
      if (event.key === 'ArrowRight') {
        const flatArr = populate(getRows(), 'right').flat(1)
        updateGame(flatArr)
      } else if (event.key === 'ArrowLeft') {
        const flatArr = populate(getRows(), 'left').flat(1)
        updateGame(flatArr)
      } else if (event.key === 'ArrowUp') {
        const flatArr = []
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < width; j++) {
            flatArr.push(populate(getCols(), 'left')[j][i])
          }
        }
        updateGame(flatArr)
      } else if (event.key === 'ArrowDown') {
        const flatArr = []
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < width; j++) {
            flatArr.push(populate(getCols(), 'right')[j][i])
          }
        }
        updateGame(flatArr)
      }
    }
  })
}

window.addEventListener('DOMContentLoaded', setUpGame)
window.addEventListener('keydown', function (e) {
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault()
  }
}, false)