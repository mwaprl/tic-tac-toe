const board = document.getElementById("board");
const status = document.getElementById("status");

let currentPlayer = "X";
let gameActive = false;
let mode = null;
let cells = [];

// create cells dynamically
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", () => handleClick(cell, i));
  board.appendChild(cell);
  cells.push("");
}

function setMode(selectedMode) {
  mode = selectedMode;
  restartGame();
  if (mode === "pvp") {
    status.textContent = "Player X's turn (PvP)";
  } else if (mode === "pvc") {
    status.textContent = "Player X's turn (vs Computer)";
  }
  gameActive = true;
}

function handleClick(cell, index) {
  if (!gameActive || cells[index] !== "") return;

  cells[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner()) {
    status.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (!cells.includes("")) {
    status.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }

  if (mode === "pvp") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s turn (PvP)`;
  } else if (mode === "pvc") {
    if (currentPlayer === "X") {
      currentPlayer = "O";
      status.textContent = "Computer's turn...";
      setTimeout(computerMove, 600);
    }
  }
}

function computerMove() {
  let emptyIndexes = cells.map((v, i) => v === "" ? i : null).filter(v => v !== null);

  let move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  const cell = document.querySelectorAll(".cell")[move];

  cells[move] = "O";
  cell.textContent = "O";
  cell.classList.add("taken");

  if (checkWinner()) {
    status.textContent = "Computer wins! 🤖";
    gameActive = false;
    return;
  }

  if (!cells.includes("")) {
    status.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  status.textContent = "Player X's turn (vs Computer)";
}

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (const [a,b,c] of winPatterns) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      document.querySelectorAll(".cell")[a].classList.add("winner");
      document.querySelectorAll(".cell")[b].classList.add("winner");
      document.querySelectorAll(".cell")[c].classList.add("winner");
      return true;
    }
  }
  return false;
}

function restartGame() {
  currentPlayer = "X";
  gameActive = mode !== null;
  cells = ["", "", "", "", "", "", "", "", ""];
  status.textContent = mode ? `Player X's turn (${mode === "pvp" ? "PvP" : "vs Computer"})` : "Choose a mode to start!";
  document.querySelectorAll(".cell").forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken", "winner");
  });
}
