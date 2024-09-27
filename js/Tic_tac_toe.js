const winingCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [0, 4, 8],
  [6, 7, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

// game soundeffects and music
var backgroundMusic = document.getElementById("backgroundMusic");
var buttonClickSound = document.getElementById("buttonClickSound");
var boardClickSound = document.getElementById("boardClickSound");
var gameOverSound = document.getElementById("gameOverSound");
var gameWinSound = document.getElementById("gameWinSound");
var matchFoundSound = document.getElementById("matchFoundSound");
var matchDrawSound = document.getElementById("matchDrawSound");

document.addEventListener("DOMContentLoaded", function () {
  var backgroundMusic = document.getElementById("backgroundMusic");
  var musicToggle = document.getElementById("musicToggle");
  var musicIcon = document.getElementById("musicIcon");

  // Initial state
  let musicPlaying = false;

  function playMusic() {
    backgroundMusic
      .play()
      .then(() => {
        musicPlaying = true;
        localStorage.setItem("musicPlaying", musicPlaying);
        musicIcon.classList.replace("fa-volume-off", "fa-volume-up");
      })
      .catch((error) => {
        console.error("Autoplay prevented:", error);
      });
  }

  function pauseMusic() {
    backgroundMusic.pause();
    musicPlaying = false;
    localStorage.setItem("musicPlaying", musicPlaying);
    musicIcon.classList.replace("fa-volume-up", "fa-volume-off");
  }
  musicToggle.addEventListener("click", function () {
    buttonClickSound.play();
    if (musicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });
  // Try to play the music when the site loads
  if (localStorage.getItem("musicPlaying") === "true") {
    playMusic();
  }
});

var cells = document.querySelectorAll(".cell");
//gameType buttons
var gameType;
var playAI = document.getElementById("playAI");
var playOnline = document.getElementById("playOnline");
var playTwoPlayer = document.getElementById("playTwoPlayer");

var playTypeContainer = document.getElementById("playTypeContainer");
var playAsContainer = document.getElementById("playAsContainer");
var playAsX = document.getElementById("playAsX");
var playAsO = document.getElementById("playAsO");
var introScreen = document.getElementById("intro");
var board = document.getElementById("board");
var playerturn = document.getElementById("turn");
var restart = document.getElementById("playagain");
var userNameEntry = document.getElementById("userNameEntry");
var endgame = document.getElementById("endgame");
var winner = document.getElementById("winner");
var loading = document.getElementById("loading");
var textField = document.getElementById("userName");
var turn;
// for aiPlayer
let COUNT = 1;
var Board = ["", "", "", "", "", "", "", "", ""];
var aiPlayer, human;
//for online multiplayer
var userName;
let playerSymbol;
var onlineInfo = document.getElementById("onlineInfo");
var player = document.getElementById("player");
var opponent = document.getElementById("opponent");
let isMyTurn = false;

playAI.onclick = () => {
  buttonClickSound.play();
  gameType = "AI";
  playTypeContainer.style.display = "none";
  playAsContainer.style.visibility = "visible";
};
playTwoPlayer.onclick = () => {
  buttonClickSound.play();
  gameType = "TwoPlayer";
  playTypeContainer.style.display = "none";
  playAsContainer.style.visibility = "visible";
};
playOnline.onclick = () => {
  buttonClickSound.play();
  gameType = "Online";
  playTypeContainer.style.display = "none";
  userNameEntry.style.display = "flex";
  document.getElementById("confirmUserName").addEventListener("click", () => {
    buttonClickSound.play();
    let value = textField.value;
    if (value.trim()) {
      console.log(value);
      userName = value;
      userNameEntry.style.display = "none";
      loading.style.display = "flex";
      loading.innerHTML = "Establishing connection...";
      setupWebSocket();
      onlineInfo.style.display = "block";
    } else {
      textField.value = "player1";
    }
  });
};

playAsX.onclick = () => {
  buttonClickSound.play();
  startGame("X");
  aiPlayer = "O";
  human = "X";
};

playAsO.onclick = () => {
  buttonClickSound.play();
  startGame("O");
  aiPlayer = "X";
  human = "O";
};

function startGame(playas) {
  board.style.visibility = "visible";
  introScreen.style.visibility = "hidden";
  playAsContainer.style.visibility = "hidden";
  turn = playas;
  playerturn.innerHTML = turn;
}

cells.forEach((cell) => {
  cell.addEventListener("click", tick, { once: true });
});

function tick(e) {
  if (gameType === "Online" && !isMyTurn) return;
  boardClickSound.play();
  const clickedCell = e.target;
  const cellIndex = Array.from(cells).indexOf(clickedCell);

  // Update board and UI
  clickedCell.classList.add("clicked");
  clickedCell.innerHTML = turn;
  clickedCell.style.cursor = "not-allowed";
  Board[cellIndex] = turn;
  if (gameType === "Online") {
    makeMove(cellIndex);
  }
  // Update turn and check for win
  swapTurn();
  playerturn.innerHTML = turn;
  checkwin();
  if (gameType === "AI") {
    // Increment move count and make AI move if needed
    COUNT++;
    if (COUNT % 2 === 0) {
      setTimeout(optimalMove, 100);
    }
  }
}

// check for winner in every step in Game
function checkwin() {
  for (let i = 0; i < winingCombinations.length; i++) {
    let [a, b, c] = winingCombinations[i];
    let cellA = cells[a].innerHTML;
    let cellB = cells[b].innerHTML;
    let cellC = cells[c].innerHTML;

    if (cellA !== "" && cellA === cellB && cellA === cellC) {
      // We have a winner
      highlightWinningCells([a, b, c], cellA);
      result(`${cellA} Wins!`);
      disableBoard();
      if (gameType === "Online" && cellA !== playerSymbol) {
        gameOverSound.play();
      }
      if (gameType !== "Online" && cellA !== human) {
        gameOverSound.play();
      } else {
        gameWinSound.play();
      }
      return cellA; // Return "X" or "O"
    }
  }

  if (!ismovesleft()) {
    result("Draw!");
    matchDrawSound.play();
    return "Draw";
  }

  return false;
}

function highlightWinningCells(indices, symbol) {
  if (human == symbol || playerSymbol == symbol) {
    indices.forEach((index) => {
      cells[index].style.backgroundColor = "green";
    });
  } else {
    indices.forEach((index) => {
      cells[index].style.backgroundColor = "red";
    });
  }
}

function disableBoard() {
  cells.forEach((cell) => {
    cell.removeEventListener("click", tick);
  });
}

//check if any move is left in the Game

function ismovesleft() {
  for (let i = 0; i < 9; i++) {
    if (cells[i].innerHTML === "") {
      return true;
    }
  }
  // Return false if no empty cells are found
  return false;
}

function result(e) {
  winner.innerHTML = e;
  console.log(e);
  board.style.zIndex = -1;
  endgame.style.visibility = "visible";
  endgame.style.zIndex = 1;
}

restart.onclick = () => {
  buttonClickSound.play();
  resetGame();
};

function resetGame() {
  if (navigator.onLine) {
    window.location.reload();
  } else {
    COUNT = 1;
    Board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach((cell) => {
      cell.innerHTML = "";
      cell.style.backgroundColor = "transparent";
      cell.style.pointerEvents = "auto";
      cell.style.cursor = "pointer";
      cell.classList.remove("clicked");
      cell.addEventListener("click", tick, { once: true });
    });
    endgame.style.visibility = "hidden";
    board.style.visibility = "hidden";
    introScreen.style.visibility = "visible";
    playTypeContainer.style.display = "flex";
  }
}

//Swap turn between players X and O
function swapTurn() {
  turn = turn === "X" ? "O" : "X";
  if (gameType === "Online") {
    isMyTurn = turn === playerSymbol; // Update turn status
    updateCellClickability();
  } // Update cell clickability based on new turn
}

function updateCellClickability() {
  cells.forEach((cell) => {
    if (isMyTurn && cell.innerHTML === "") {
      cell.style.pointerEvents = "auto";
    } else {
      cell.style.pointerEvents = "none";
    }
  });
}

// *******************************##################################************************************
//AI logic for Tic-Tac-Toe

//find optimal move for aiPlayer
function optimalMove() {
  let highscore = -Infinity;
  let move = null;
  let score;
  let depth = 0;
  let alpha = -Infinity;
  let beta = Infinity;
  for (let i = 0; i < 9; i++) {
    if (Board[i] == "") {
      Board[i] = aiPlayer;
      score = minimax(Board, depth, false, alpha, beta);
      if (score > highscore) {
        highscore = score;
        move = i;
      }
      Board[i] = "";
    }
  }
  if (move != null) cells[move].click();
  checkwin();
}

//Score board for respective players

let scores = {
  aiPlayer: 10,
  human: -10,
  Draw: 0,
};

//minimax algorithm with alpha-beta prunning to calculate highScore for aiPlayer
let k = 0;
function minimax(boardCells, depth, maximizing, alpha, beta) {
  let result = checkwinner(boardCells);
  if (result != false) {
    return scores[result];
  }
  if (maximizing) {
    let highscore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardCells[i] == "") {
        boardCells[i] = aiPlayer;
        let score = minimax(boardCells, depth + 1, false, alpha, beta);
        boardCells[i] = "";
        highscore = Math.max(score, highscore);
        alpha = Math.max(alpha, highscore);

        //alphabeta prunning
        if (beta <= alpha) {
          //console.log("Pruned at depth " + depth + ", alpha: " + alpha + ", beta: " + beta);
          break;
        }
        //console.log("algorithm iteration  :"+k++);
      }
    }
    return highscore;
  } else {
    let highscore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardCells[i] == "") {
        boardCells[i] = human;
        let score = minimax(boardCells, depth + 1, true, alpha, beta);
        boardCells[i] = "";
        highscore = Math.min(score, highscore);
        beta = Math.min(beta, highscore);

        //alpha beta prunning
        if (beta <= alpha) {
          //console.log("Pruned at depth " + depth + ", alpha: " + alpha + ", beta: " + beta);
          break;
        }
        //  console.log("algorithm iteration  :"+k++);
      }
    }
    return highscore;
  }
}

//function to checkWinner for virtualBoard, not in actual game

function checkwinner(board) {
  // Check all winning combinations
  for (let i = 0; i < winingCombinations.length; i++) {
    const [a, b, c] = winingCombinations[i];
    const valueA = board[a];
    const valueB = board[b];
    const valueC = board[c];

    // Check if all three values are the same and not empty
    if (valueA === valueB && valueB === valueC && valueA !== "") {
      if (valueA === aiPlayer) {
        return "aiPlayer";
      } else {
        return "human";
      }
    }
  }
  // Check for draw (no empty cells)
  const isDraw = board.every((cell) => cell !== "");
  if (isDraw) {
    return "Draw";
  }
  return false; // No winner and no draw
}

// *******************************##################################************************************

//logic for online multiplayer game
// Create a new WebSocket connection
let socket;

function setupWebSocket() {
  if (gameType === "Online") {
    socket = new WebSocket("wss://tictactoe-sn6j.onrender.com/");

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      // console.log("data", data);

      if (data.type === "start") {
        matchFoundSound.play();
        playerSymbol = data.symbol;
        isMyTurn = playerSymbol === "X";
        player.innerHTML = userName + " : " + playerSymbol;
        startGame("X");
        socket.send(JSON.stringify({ type: "opponent", name: userName }));
      }

      if (data.type === "waiting") {
        loading.style.display = "flex";
        loading.innerHTML = "Searching opponent...";
      } else if (data.type === "opponent") {
        let opponentName = data.name;
        if (data.name == "player1" || data.name == "" || !data.name) {
          opponentName = "Opponent";
        }
        opponent.innerHTML =
          opponentName + " : " + (playerSymbol === "X" ? "O" : "X");
      } else {
        loading.style.display = "none";
      }

      if (data.type === "move") {
        receiveMove(data.position, data.symbol);
      }
    });

    socket.addEventListener("open", () => {
      console.log("Connection established.");
    });

    socket.addEventListener("error", (error) => {
      loading.style.display = "flex";
      loading.innerHTML =
        "Error establishing connection. Please refresh and try again.";

      console.error("WebSocket error:", error);
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed.");
    });
  } else {
    console.log("Game type is not Online. WebSocket setup is skipped.");
  }
}

// Function to make a move and send it to the server
function makeMove(position) {
  if (gameType === "Online" && socket) {
    const moveData = { type: "move", position: position, symbol: turn };
    socket.send(JSON.stringify(moveData));
  } else {
    console.log("Not in online game mode or WebSocket is not initialized.");
  }
}
``;

// Function to receive and apply the opponent's move
function receiveMove(position, symbol) {
  const cell = cells[position];
  if (cell.innerHTML === "") {
    cell.innerHTML = symbol; // Update the cell with the opponent's symbol
    cell.style.cursor = "not-allowed"; // Disable further interaction with this cell
    cell.classList.add("clicked"); // Mark the cell as clicked
    cell.removeEventListener("click", tick);
    // Remove the click event listener
    checkwin();
    swapTurn();
    playerturn.innerHTML = turn;
  }
}

setupWebSocket();

// Service Worker
let deferredPrompt;

// Function to check if the app is already installed
function isAppInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone
  );
}

window.addEventListener("beforeinstallprompt", (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = event;

  // Only show the install button if the app is not already installed
  if (!isAppInstalled()) {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt = null;
    });
  }
});
