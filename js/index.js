
window.addEventListener('load', startGame);


function startGame() {
  const amountOfTiles = 9,
      container = document.querySelector('.container'),
      playerTurnField = document.querySelector('.display-player'),
      resetButton = document.querySelector('#reset'),
      winningText = document.querySelector('.announcer');
 
      
  const four = 4;
  const gameField = 
  [
    '', '', '',
    '', '', '',
    '', '', ''
  ],
  // winningCombinations = [[0, 1, 2],[3, 4, 5],[6,7,8],
  //                       [0,3,6],[1,4,7],[2,5,8],
  //                       [0,4,8],[2,4,6]];
  winningCombinations = [[0, 1, 1+1],[four-1, four, four+1],[four+1+1,four+four-1,four+four],
                        [0,four-1,four+1+1],[1,four,four+four-1],[four-1-1,four+1,four+four],
                        [0,four,four+four],[four-1-1,four,four+1+1]];


  let choosedTile = -1;

  createGameField(amountOfTiles);


  function createGameField(amountOfTiles){
    for (let i = 0; i < amountOfTiles; i++){
      let div = document.createElement('div');
      div.value = i;
      div.classList.add('tile');
      container.appendChild(div);
    }
  }

  let currentPlayer = chooseRandomPlayer();
  setDisplayedPlayer(currentPlayer);
  playerTurnField.innerHTML = currentPlayer;

  function chooseRandomPlayer(){
    let max = 2;
    let randomValue = Math.floor(Math.random() * max)
    return randomValue === 1 ? 'X' : 'O';
  }

  function setDisplayedPlayer(currentPlayer){
      playerTurnField.classList.remove('playerX')
      playerTurnField.classList.remove('playerO')
      playerTurnField.classList.add(`player${currentPlayer}`)
  }


  function setGameTile(currentTile){
    clearAllTileFocus();
    currentTile.innerHTML = currentPlayer;
    currentTile.classList.add(`player${currentPlayer}`)

    choosedTile = currentTile.value;
  }


    function clearAllTileFocus(){
      const tiles = container.children;

      for (let i = 0; i < amountOfTiles; i++){
        tiles[i].classList.remove('active');
      }
    }


    function setNextPlayer(){
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      playerTurnField.innerHTML = currentPlayer;
      setDisplayedPlayer(currentPlayer);
    }

    function isLastAttempt(){
      return gameField.join('').match(/\w/g).length >= amountOfTiles;
    }


  function isPlayerWon(currentPlayer){
      for(let i = 0; i < winningCombinations.length; i++){
        let winningCombination = winningCombinations[i];
        let a = gameField[winningCombination[0]];
        let b = gameField[winningCombination[1]];
        let c = gameField[winningCombination[1+1]];

        if (a === b && b === c && (a !== '' || b !== '' || c !=='')) {
          gameWon(currentPlayer);
          return true;
        }
      }

    }

    // GAME END
    // ********

    function gameWon(currentPlayer){
      container.removeEventListener('click', clickHandler);
      winningText.style.display = 'block';
      winningText.innerHTML = 'Player';

      const span = document.createElement('span');
      span.classList.add(`player${currentPlayer}`);
      span.innerHTML = ` ${currentPlayer} Won!`;
      winningText.appendChild(span);
    }

    function gameTie(){
      container.removeEventListener('click', clickHandler);
      winningText.style.display = 'block';
      winningText.innerHTML = 'Player';

      winningText.innerHTML = 'Tie';
    }

    // DRAG ICONS HANDLING
    // *******************

    const draggables = document.querySelectorAll('.avatar-icon'),
          box = document.querySelectorAll('.avatar-container'),
          icons = document.querySelector('.icons'),
          iconsImg = document.querySelectorAll('.avatar-icon');


    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', dragstart);

      draggable.addEventListener('dragend', dragend);
    })


    box.forEach(box => {
      box.addEventListener('dragover', () => {
        const dragging = document.querySelector('.dragging');
        if (box.children.length){
          return;
        }
        box.appendChild(dragging);
      });
    })

    icons.addEventListener('dragover', () => {
      const dragging = document.querySelector('.dragging');
      icons.appendChild(dragging);
    })


    function dragstart(e){
      e.target.classList.add('dragging');
    }

    function dragend(e){
      e.target.classList.remove('dragging');
    }

    container.addEventListener('click', clickHandler);

    // DISABLE / ENABLE DRAG
    // *********************

    function disableDrag(){
      iconsImg.forEach(icon => {
        icon.setAttribute('draggable', 'false');
      })
    }

    function enableDrag(){
      iconsImg.forEach(icon => {
        icon.setAttribute('draggable', 'true');
      })
    }

    // CLICK ON TILE
    // *************


    function clickHandler(event){

      let currentTile = event === undefined ? container.children[choosedTile] : event.target;
      let currentTileValue = currentTile.value;

      if (gameField[currentTileValue] !== ''){
        return;
      }

      if (!isPlayeresChosen()){
        alert('Please, choose players (Drag over to block)');
        return;
      }

      disableDrag();

      setGameTile(currentTile);

      
      gameField[currentTileValue] = currentPlayer;
      
      if(isPlayerWon(currentPlayer)){
        return;
      }

      if(isLastAttempt()){
        gameTie();
      }

      setNextPlayer();
    }


    function isPlayeresChosen(){
      let count = 0;
      let boxLenght = box.length;
      box.forEach( box => {
        if (box.children.length === 1){
          count++;
        }
      })
      return count === boxLenght;
    }

    // RESET GAME
    // **********

    resetButton.addEventListener('click', resetGame)

    function resetGame(){
      container.addEventListener('click', clickHandler);
      const tiles = container.children;

      winningText.style.display = 'none';
      winningText.innerHTML = '';

      for (let i = 0; i < amountOfTiles; i++){
        tiles[i].innerHTML = '';
        tiles[i].classList.remove('playerX')
        tiles[i].classList.remove('playerO')
        gameField[i] = '';
      }

      box.forEach(box => {
        if(box.children.length){
          icons.appendChild(box.firstChild);
        }
      })
      
      choosedTile = 0;
      clearAllTileFocus();
      enableDrag();
    }


    // KEYHANDLING
    // ***********

    const enterPressed = new KeyboardEvent('enterPressed');

    function pressEnter(){
      const activeElement = document.querySelector('.active');

      if(activeElement){
        clickHandler();
      }
    }

   window.addEventListener('enterPressed', pressEnter);

   window.addEventListener('keydown', (e) => {
      let key = e.keyCode
      const enterKey = 13

      if ( key === enterKey){
        window.dispatchEvent(enterPressed);
      }
    })
    

    window.addEventListener('keydown', chooseTile);

    function chooseTile(e){
      clearAllTileFocus();

      let pressedKey = e.keyCode;

      let leftArrow = 37;
      let rightArrow = 39;

      const tiles = container.children;

      switch(pressedKey){

        case leftArrow:
          choosedTile > 0 ? choosedTile-- : choosedTile = amountOfTiles - 1;
          break;

        case rightArrow:
          choosedTile < amountOfTiles - 1 ? choosedTile++ : choosedTile = 0;
          break;

        default:
          break;
      }

      tiles[choosedTile].classList.add('active');
    }
}