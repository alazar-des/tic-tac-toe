let moves = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

function checkBoard() {
  for (let row = 0; row < 3; row++) {
    if (moves[row][0] == moves[row][1] && moves[row][1] == moves[row][2])
      return moves[row][0];
  }

  for (let col = 0; col < 3; col++) {
    if (moves[0][col] == moves[1][col] && moves[1][col] == moves[2][col])
      return moves[0][col];
  }

  if (moves[0][0] == moves[1][1] && moves[1][1] == moves[2][2] || 
    moves[2][0] == moves[1][1] && moves[1][1] == moves[0][2])
      return moves[1][1];
}

function leftMove() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (!moves[row][col])
        return true;
    }
  }
  return false;
}

const Player = (() => {
  easy: function easy() {
    let pos = Math.floor(Math.random() * 9);
    let i = parseInt(pos / 3);
    let j = pos % 3;
    return "" + i + j;
  }

  function evaluate() {
    if (checkBoard() == 'o')
      return 10;
    if (checkBoard() == 'x')
      return -10;
    return 0;
  }

  function minimax(turn) {
    let score = evaluate();
    if (score != 0 || !leftMove())
      return score;

    if (turn) {
      let bestScore = -Infinity;
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (!moves[row][col]) {
            moves[row][col] = 'o';
            bestScore = Math.max(bestScore, minimax(!turn));
            moves[row][col] = "";
          }
        }
      }
      return bestScore;
    }
    else {
      let bestScore = Infinity;
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (!moves[row][col]) {
            moves[row][col] = 'x';
            bestScore = Math.min(bestScore, minimax(!turn));
            moves[row][col] = "";
          }
        }
      }
      return bestScore;
    }
  }

  impossible: function impossible() {
    let bestScore = -Infinity;
    let bestmove;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (!moves[row][col]) {
          moves[row][col] = 'o';
          let score = minimax(false);
          moves[row][col] = "";
          if (bestScore < score) {
            bestScore = score;
            bestmove = "" + row + col;
          }
        }
      }
    }
    return bestmove;
  }

  return {
    easy,
    impossible
  }
})();

(function gameController() {
  const gameboard = document.querySelectorAll(".gameboard div");
  gameboard.forEach(space => space.addEventListener('click', handleMove));

  const resetBtn = document.querySelector(".reset");
  resetBtn.addEventListener('click', resetGame);

  const boardContainer = document.querySelector(".winner");
  boardContainer.addEventListener('click', () => {
    boardContainer.style.display = 'none';
    resetGame();
  });

  const nextPlayer = document.querySelector(".next-player span");
  const player_x = document.querySelector(".player-x");
  const player_o = document.querySelector(".player-o");
  player_x.classList.add('turn');
  let turn = 'x';
  nextPlayer.textContent = turn;

  const select = document.querySelector("#select-level");
  let player = select.value;
  select.addEventListener('change', () => {
    player = select.value;
    resetGame();
  });

  function handleMove(event) {
    if (player == "friend" || turn == 'x') handlePlayerMove(event.target);
  }

  function handlePlayerMove(target) {
    if (target.textContent == "") {
      mark(target);
      registerMove(target);
      const result = checkMove();
      if (!result) {
        continueGame();
      } else if (result == 'draw') {
        document.querySelector('.winner h1').textContent = "It's a draw";
        document.querySelector('.winner').style.display = 'block';
      } else {
        document.querySelector('.winner h1').textContent = `${turn} wins!`;
        document.querySelector('.winner').style.display = 'block';
      }
    }
    if (player != "friend" && turn == 'o') computer();
  }

  function mark(target){
    target.textContent = turn;
    target.classList.add(turn);
  }

  function registerMove(target) {
    const pos = target.getAttribute('pos').split("");
    let i = parseInt(pos[0]);
    let j = parseInt(pos[1]);
    moves[i][j] = turn;
  }

  function continueGame() {
    player_x.classList.toggle('turn');
    player_o.classList.toggle('turn');
    turn = turn == 'x' ? 'o' : 'x';
    nextPlayer.textContent = turn;
  }

  function resetGame () {
    gameboard.forEach(space => {
      space.textContent = "";
      space.classList.remove('x');
      space.classList.remove('o');
    });

    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 3; col++)
        moves[row][col] = "";

    player_x.classList.remove('turn');
    player_o.classList.remove('turn');
    player_x.classList.add('turn');
    turn = 'x';
    nextPlayer.textContent = turn;
  }

  function checkMove() {
    const winner = checkBoard();
    if (winner) {
      return(winner);
    } else if (!leftMove()){
      return('draw');
    }
  }

  function computer() {
    let pos = Player[player]();
    const target = document.querySelector(`div[pos="${pos}"]`);
    handlePlayerMove(target);
  }
})();