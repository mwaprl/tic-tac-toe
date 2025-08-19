const board = document.getElementById("game-board");
const status = document.getElementById("status");

let currentPlayer = "X";
let cells = ["", "", "", "", "", "", "", "", ""];

function createBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = index;
    div.addEventListener("click", handleMove);
    div.textContent = cell;
    board.appendChild(div);
  });
}

function handleMove(e) {
  const index = e.target.dataset.index;
  if (cells[index] !== "") return;
  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    status.textContent = `Player ${currentPlayer} wins!`;
    board.querySelectorAll(".cell").forEach(cell => cell.removeEventListener("click", handleMove));
    return;
  }

  if (!cells.includes("")) {
    status.textContent = "It's a draw!";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  status.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index] === currentPlayer)
  );
}

function restartGame() {
  currentPlayer = "X";
  cells = ["", "", "", "", "", "", "", "", ""];
  status.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
}

createBoard();
