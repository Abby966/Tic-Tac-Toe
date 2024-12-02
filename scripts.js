const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status");
const resetBtn = document.querySelector(".resetBtn");
const startBtn = document.querySelector(".start");
const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const form = document.querySelector(".form");

// Game options
const options = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let currentPlayer = "X";
let gameRunning = false;

startBtn.addEventListener("click", initializeGame);

// Initialize the game
function initializeGame() {
  if (player1.value == "") {
    alert("Please Enter Player 1 Name");
    return;
  }
  player2.value = "Computer"; // Player 2 is always the computer
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  statusText.textContent = `${playerName(currentPlayer)}'s Turn`;
  resetBtn.addEventListener("click", resetGame);
  gameRunning = true;
  form.style.display = "none";
}

function playerName(current) {
  return current == "X" ? player1.value : player2.value;
}

function cellClicked() {
  const cellIdx = this.getAttribute("cellIndex");
  if (options[cellIdx] !== "" || !gameRunning || currentPlayer === "O") {
    return;
  }
  updateCell(this, cellIdx);
  checkWinner();
  if (gameRunning) {
    setTimeout(computerMove, 500); // Delay for computer's move
  }
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function changeStatus() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${playerName(currentPlayer)}'s Turn`;
}

function checkWinner() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const condition = winningConditions[i];
    const A = options[condition[0]];
    const B = options[condition[1]];
    const C = options[condition[2]];

    if (A == "" || B == "" || C == "") {
      continue;
    }

    if (A == B && B == C) {
      roundWon = true;
      gameRunning = false;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${playerName(currentPlayer)} Won!!`;
  } else if (!options.includes("")) {
    statusText.textContent = `Draw!!!`;
  } else {
    changeStatus();
  }
}


function computerMove() {
  // Check for available cells
  const availableCells = options
    .map((val, idx) => (val === "" ? idx : null))
    .filter((val) => val !== null);

  if (availableCells.length > 0) {
    let cellIdx;

    // Priority 1: Check if the computer can win in the next move
    cellIdx = findWinningMove("O"); // Assuming "O" is the computer's symbol
    if (cellIdx === null) {
      // Priority 2: Block the player's winning move
      cellIdx = findWinningMove("X"); // Assuming "X" is the player's symbol
    }
    if (cellIdx === null) {
      // Priority 3: Choose the center if available
      if (options[4] === "") {
        cellIdx = 4;
      } else {
        // Priority 4: Choose a random available cell as fallback
        cellIdx = availableCells[Math.floor(Math.random() * availableCells.length)];
      }
    }

    const cell = cells[cellIdx];
    updateCell(cell, cellIdx);
    checkWinner();
  }
}

// Helper function to find a winning move
function findWinningMove(symbol) {
  // Winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    const line = [options[a], options[b], options[c]];

    // Check if two cells are filled with the same symbol and the third is empty
    if (line.filter((val) => val === symbol).length === 2 && line.includes("")) {
      return combo[line.indexOf("")];
    }
  }
  return null; // No winning move found
}


function resetGame() {
  currentPlayer = "X";
  options.fill("");
  statusText.textContent = `${player1.value}'s Turn`;
  cells.forEach((cell) => (cell.textContent = ""));
  player1.value = "";
  player2.value = "";
  gameRunning = false;
  form.style.display = "flex";
}
