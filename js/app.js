import { dictionary } from './dictionary.js';
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill('')),
  currentRow: 0,
  currentColumn: 0
};
const check = document.getElementById('check');
const reset = document.getElementById('reset');
function update() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const cell = document.getElementById(`cell${i}${j}`);
      cell.textContent = state.grid[i][j];
    }
  }
}
function keyboard() {
  document.body.onkeydown = (e) => {
    const key = e.key;

    if (key === 'Backspace') {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }
    update();
  };
}
function start() {
  const game = document.getElementById('game');
  drawGrid(game);
  keyboard();
  console.log(state.secret);
}
function drawCell(container, row, column, letter = '') {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = `cell${row}${column}`;
  cell.textContent = letter;
  container.appendChild(cell);
  return cell;
}

function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawCell(grid, i, j);
    }
  }
  container.appendChild(grid);
}
function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}
function isWordValid(word) {
  return dictionary.includes(word);
}
function revealWord(word) {
  const row = state.currentRow;
  for (let i = 0; i < 5; i++) {
    const cell = document.getElementById(`cell${row}${i}`);
    const letter = cell.textContent;
    if (letter === state.secret[i]) {
      cell.classList.add('right');
    } else if (state.secret.includes(letter)) {
      cell.classList.add('wrong');
    } else {
      cell.classList.add('empty');
    }
  }
  const isWinner = state.secret === word;
  const gameOver = state.currentRow === 5;
  if (isWinner) {
    alert('Congratulations');
    setTimeout(function () {
      document.location.reload();
    }, 5000);
  } else if (gameOver) {
    alert('Better luck next time. The word was ' + state.secret);
  }
}
function isLetter(key) {
  return key.length === 1 && key.match(/[А-Я а-я Іі Єє Її]/i);
}
function addLetter(letter) {
  if (state.currentColumn === 5) {
 return; 
}
  state.grid[state.currentRow][state.currentColumn] = letter;
  state.currentColumn++;
}
function removeLetter() {
  if (state.currentColumn === 0) {
 return; 
}
  state.grid[state.currentRow][state.currentColumn - 1] = '';
  state.currentColumn--;
}
check.addEventListener('click', function () {
  if (state.currentColumn === 5) {
    const word = getCurrentWord();
    if (isWordValid(word)) {
      revealWord(word);
      state.currentRow++;
      state.currentColumn = 0;
    } else {
      alert('Not a valid word');
      while (state.currentColumn !== 0) {
        removeLetter();
      }
    }
  }
});
reset.addEventListener('click', function () {
  document.location.reload();
});
start();
