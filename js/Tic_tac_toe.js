
const winingcombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [2, 4, 6],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
];
const cells = document.querySelectorAll('.cell');
var playAsX = document.getElementById("playAsX");
var playAsO = document.getElementById("playAsO");
var introScreen = document.getElementById("intro");
var board = document.getElementById("board");
var playerturn = document.getElementById("turn");
var restart = document.getElementById("playagain");
var endgame = document.getElementById("endgame");
var winner = document.getElementById("winner");
var turn;
playAsX.onclick = () => {
    startgame("X");
}
playAsO.onclick = () => {
    startgame("O");
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
var count = 0;
function tick(e) {
    var clickedid = e.target.id;
    var clk = document.getElementById(clickedid);
    if (turn == "X") {
        clk.innerHTML = "X";
        turn = "O";
        playerturn.innerHTML = turn;
    }
    else {
        clk.innerHTML = "O";
        turn = "X";
        playerturn.innerHTML = turn;
    }
    clk.style.cursor = "not-allowed";
    count++;
    checkwin();
}
function checkwin() {

    for (i = 0; i < 8; i++) {
        XWins = 0;
        OWins = 0;
        OWon = false;
        XWon = false;
        for (j = 0; j < 3; j++) {
            if (cells[winingcombinations[i][j]].innerHTML === "X") {
                XWins += 1;
            }
            if (cells[winingcombinations[i][j]].innerHTML === "O") {
                OWins += 1;
            }
            if (XWins == 3) {
                Xwon = true;
                result("X Wins!");
                return false;
            }
            if (OWins == 3) {
                Owon = true;
                result("O wins!");
                return false;
            }
            else if (count == 9) {
                result("Draw !");
            }
        }
    }
}


function result(e) {
    winner.innerHTML = e;
    board.style.visibility = "hidden";
    endgame.style.visibility = "visible";
}
restart.onclick = () => {
    location.reload();
}