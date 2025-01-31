const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("startBtn");
let board, score;

// Get a random empty cell
function getRandomEmptyCell() {
    let emptyCells = [];
    board.forEach((row, r) =>
        row.forEach((cell, c) => {
            if (cell === 0) emptyCells.push({ r, c });
        })
    );
    return emptyCells.length > 0
        ? emptyCells[Math.floor(Math.random() * emptyCells.length)]
        : null;
}

// Add a new tile (either 2 or 4) if a valid move was made
function addNewTile() {
    let cell = getRandomEmptyCell();
    if (cell) board[cell.r][cell.c] = Math.random() > 0.9 ? 4 : 2;
}

// Draw the game board
function drawBoard() {
  boardElement.innerHTML = "";
  board.forEach((row) =>
      row.forEach((cell) => {
          let tile = document.createElement("div");
          tile.classList.add("tile");
          tile.textContent = cell !== 0 ? cell : "";

          // Get background and text color
          let { bg, text } = getTileColor(cell);
          tile.style.background = bg;
          tile.style.color = text; 

          boardElement.appendChild(tile);
      })
  );
  scoreElement.textContent = score;
}

// Tile colors based on value
function getTileColor(value) {
  const colors = {
      0: { bg: "#cdc1b4", text: "#000" }, 
      2: { bg: "#ff9a9e", text: "#000" },
      4: { bg: "#c01616", text: "#000" },
      8: { bg: "#b3d82b", text: "#000" },
      16: { bg: "#58d2ca", text: "#000" },
      32: { bg: "#a958d2", text: "#000" },
      64: { bg: "#bb342f", text: "#000" },
      128: { bg: "#a93e7b", text: "#000" },
      256: { bg: "#8e44ad", text: "#000" },
      512: { bg: "#5a3f99", text: "#000" },
      1024: { bg: "#2c3e50", text: "#000" },
      2048: { bg: "#f39c12", text: "#000" }
  };
  return colors[value] || { bg: "#3c3a32", text: "#000" }; 
}


// Slide function to move and merge tiles
function slide(row) {
    let arr = row.filter((num) => num); // Remove zeros
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
        }
    }
    arr = arr.filter((num) => num); // Remove zeros again after merging
    while (arr.length < 4) arr.push(0); // Fill with zeros
    return arr;
}

// Rotate board to simulate movement in different directions
function rotateBoard(dir) {
    let newBoard;
    if (dir === "left") return board.map((row) => slide(row));
    if (dir === "right") return board.map((row) => slide(row.reverse()).reverse());
    if (dir === "up") {
        newBoard = board[0].map((_, i) => board.map(row => row[i])); // Transpose
        newBoard = newBoard.map(row => slide(row));
        return newBoard[0].map((_, i) => newBoard.map(row => row[i])); // Transpose back
    }
    if (dir === "down") {
        newBoard = board[0].map((_, i) => board.map(row => row[i])); // Transpose
        newBoard = newBoard.map(row => slide(row.reverse()).reverse());
        return newBoard[0].map((_, i) => newBoard.map(row => row[i])); // Transpose back
    }
}

// Move function with valid movement detection
function move(direction) {
    let newBoard = rotateBoard(direction);

    if (JSON.stringify(board) !== JSON.stringify(newBoard)) { // Only update if board changed
        board = newBoard;
        addNewTile();
    }

    drawBoard();

    if (isGameOver()) {
        setTimeout(() => {
            alert("Game Over!");
            resetGame();
        }, 100);
    }
}

// Check if the game is over
function isGameOver() {
    if (getRandomEmptyCell()) return false; // If empty cell exists, game is not over

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (
                (r < 3 && board[r][c] === board[r + 1][c]) || // Check down
                (c < 3 && board[r][c] === board[r][c + 1])    // Check right
            ) {
                return false;
            }
        }
    }
    return true; // No moves left
}

// Reset the game
function resetGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    drawBoard();
    startButton.style.visibility = "visible";
    boardElement.style.visibility = "hidden";
}

// Start the game
startButton.addEventListener("click", () => {
    startButton.style.visibility = "hidden";
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    addNewTile();
    addNewTile();
    drawBoard();
    boardElement.style.visibility = "visible";
});

// Listen for arrow key presses
document.addEventListener("keydown", (e) => {
    if (e.key.startsWith("Arrow")) move(e.key.slice(5).toLowerCase());
});

// Initialize the game
startButton.style.visibility = "visible";
