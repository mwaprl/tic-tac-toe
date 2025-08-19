const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const pvpBtn = document.getElementById("pvp");
const aiBtn = document.getElementById("ai");

let cells = [];
let currentPlayer = "X";
let gameOver = false;
let vsAI = false;

function startGame() {
  board.innerHTML = "";
  cells = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  statusText.textContent = "Player X's turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const idx = e.target.dataset.index;

  if (cells[idx] !== "" || gameOver) return;

  makeMove(idx, currentPlayer);

  if (!gameOver && vsAI && currentPlayer === "O") {
    setTimeout(() => {
      const bestMove = findBestMove();
      makeMove(bestMove, "O");
    }, 500);
  }
}

function makeMove(idx, player) {
  cells[idx] = player;
  const cellEl = board.querySelector(`[data-index='${idx}']`);
  cellEl.textContent = player;
  cellEl.classList.add("taken");

  if (checkWin(player)) {
    statusText.textContent = `Player ${player} Wins!`;
    highlightWin(player);
    gameOver = true;
  } else if (!cells.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameOver = true;
  } else {
    currentPlayer = player === "X" ? "O" : "X";
    if (!vsAI || currentPlayer === "X") {
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

function checkWin(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index] === player)
  );
}

function highlightWin(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  winPatterns.forEach(pattern => {
    if (pattern.every(index => cells[index] === player)) {
      pattern.forEach(index => {
        const cellEl = board.querySelector(`[data-index='${index}']`);
        cellEl.classList.add("winner");
      });
    }
  });
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (cells[i] === "") {
      cells[i] = "O";
      let score = minimax(cells, 0, false);
      cells[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return depth - 10;
  if (!newBoard.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

restartBtn.addEventListener("click", startGame);
pvpBtn.addEventListener("click", () => { vsAI = false; startGame(); });
aiBtn.addEventListener("click", () => { vsAI = true; startGame(); });

startGame();
