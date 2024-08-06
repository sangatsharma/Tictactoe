const winingcombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [0, 4, 8],
    [6, 7, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
];

var cells = document.querySelectorAll('.cell');
var playAsX = document.getElementById("playAsX");
var playAsO = document.getElementById("playAsO");
var introScreen = document.getElementById("intro");
var board = document.getElementById("board");
var playerturn = document.getElementById("turn");
var restart = document.getElementById("playagain");
var endgame = document.getElementById("endgame");
var winner = document.getElementById("winner");
var turn;
let COUNT = 1;
var win = null;
var Board = ["", "", "", "", "", "", "", "", ""];
var aiPlayer, human;

playAsX.onclick = () => {
    startgame("X");
    aiPlayer = "O";
    human = "X";
}

playAsO.onclick = () => {
    startgame("O");
    aiPlayer = "X";
    human = "O";
}

function startgame(playas) {
    board.style.visibility = "visible";
    introScreen.style.visibility = "hidden";
    turn = playas;
    playerturn.innerHTML = turn;
}

cells.forEach(cell => {
    cell.addEventListener('click', tick, { once: true });
});

function tick(e) {
    var clickedid = e.target;
    var clk = document.getElementById(clickedid.id);
    clk.classList.add('clicked');
    Board[Array.from(cells).indexOf(clickedid)] = turn;
    clk.innerHTML = turn;
    swapTurn();
    playerturn.innerHTML = turn;
    clk.style.cursor = "not-allowed";
    checkwin();
    COUNT++;
    if (COUNT % 2 == 0) {
        const myTimeout = setTimeout(optimalMove, 100);
       
    }
}

// check for winner in every step in Game

function checkwin() {
    for (let i = 0; i < 8; i++) {
        var XWins = 0;
        var OWins = 0;
        for (let j = 0; j < 3; j++) {
            if (cells[winingcombinations[i][j]].innerHTML === "X") {
                XWins += 1;
            }
            if (cells[winingcombinations[i][j]].innerHTML === "O") {
                OWins += 1;
            }
            if (XWins == 3) {
                win = "X";
                for (let k = 0; k < 3; k++) {
                    cells[winingcombinations[i][k]].style.backgroundColor = "green";
                }
                result("X Wins!");
                cells.forEach(cell => {
                    cell.removeEventListener('click', tick);
                });
                return "X";
            }
            if (OWins == 3) {
                win = "O";
                for (let k = 0; k < 3; k++) {
                    cells[winingcombinations[i][k]].style.backgroundColor = "green";
                }

                result("O wins!");
                cells.forEach(cell => {
                    cell.removeEventListener('click', tick);
                });
                return "O";
            }
        }
    }
    if (!ismovesleft() && OWins != 3 && XWins != 3) {
        win = "Draw";
        result("Draw !");
        return 'Draw';
    }
    return false;
}

//check if any move is left in the Game

function ismovesleft() {
    let flag = false;
    for (let i = 0; i < 9; i++) {
        if (cells[i].innerHTML == "") {
            flag = true;
        }
    }
    if (flag == true) {
        return true;
    }
    else return false;
}

function result(e) {
    winner.innerHTML = e;
    console.log(e);
    board.style.zIndex = -1;
    endgame.style.visibility = "visible";
    endgame.style.zIndex = 1;
}
restart.onclick = () => {
    location.reload();
}

//Swap turn between players X and O
function swapTurn() {
    if (turn == "X") {
        turn = "O";
    }
    else {
        turn = "X";
    }
}

//find optimal move for aiPlayer

function optimalMove() {
    let highscore = -Infinity;
    let move = null;
    let score;
    let depth = 0;
    let alpha=-Infinity;
    let beta=Infinity;
    for (let i = 0; i < 9; i++) {
        if (Board[i] == "") {
        Board[i] = aiPlayer;
        score = minimax(Board, depth, false,alpha,beta);
            if (score > highscore) {
                highscore = score;
                move = i;
            }
            Board[i] = "";
        }
    }
    if (move != null)
        cells[move].click();
    checkwin();
}

//Score board for respective players

let scores = {
    "aiPlayer": 10,
    "human": -10,
    "Draw": 0,
};

//minimax algorithm with alpha-beta prunning to calculate highScore for aiPlayer
let k=0;
function minimax(boardCells, depth, maximizing,alpha, beta) {
    let result = checkwinner(boardCells);
    if (result != false) {
        return scores[result];
    }
    if (maximizing) {
        let highscore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardCells[i] == "") {
                boardCells[i] = aiPlayer;
                let score = minimax(boardCells, depth + 1, false,alpha,beta);
                boardCells[i] = "";
                highscore=Math.max(score,highscore);
                alpha=Math.max(alpha,highscore);

                //alphabeta prunning

                if(beta<=alpha){
                    //console.log("Pruned at depth " + depth + ", alpha: " + alpha + ", beta: " + beta);
                    break;}
                
                //console.log("algorithm iteration  :"+k++);
            }
        }
        return highscore;
    } else {
        let highscore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardCells[i] == "") {
                boardCells[i] = human;
                let score = minimax(boardCells, depth + 1, true,alpha,beta);
                boardCells[i] = "";
                highscore=Math.min(score,highscore);
                beta=Math.min(beta,highscore);

            //alpha beta prunning
            
             if(beta<=alpha){
                 //console.log("Pruned at depth " + depth + ", alpha: " + alpha + ", beta: " + beta);
                break;}
                
          //  console.log("algorithm iteration  :"+k++);
            }
        }
        return highscore;
    }
}

//function to checkWinner for virtualBoard, not in actual game

function checkwinner(board) {
    for (let i = 0; i < 8; i++) {
        var XWins = 0;
        var OWins = 0;
        for (let j = 0; j < 3; j++) {
            if (board[winingcombinations[i][j]] =="X") {
                XWins += 1;
            }
            if (board[winingcombinations[i][j]] == "O") {
                OWins += 1;
            }
            if (XWins == 3) {
                if(aiPlayer=="X")
                return "aiPlayer";
            else return "human";
            }
            if (OWins == 3) {
                if(aiPlayer=="O")
                return "aiPlayer";
            else return "human";
            }
        }
    }
    if (OWins != 3 && XWins != 3) {
        let flag = false;
        for (let i = 0; i < 9; i++) {
            if (board[i] == "") {
                flag = true;
            }
        }
        if (flag == false)
            return 'Draw';
    }
    return false;
}
