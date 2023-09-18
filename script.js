const gameboard = (() => {
    const board = [];
    const rows = 3;
    const cols = 3;
    
    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let col = 0; col < cols; col++) {
            board[row][col] = 0;
        }
    }

    const getBoard = () => { return board; };

    const addSign = (index, player) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        if (board[row][col] !== 0) {
            return undefined;
        } else {
            board[row][col] = player.sign;
        }
    }
    
    const clearBoard = () => {
        board.forEach(row => {row.forEach((cellValue, columnIndex) => {
            row[columnIndex] = 0;
        });
    })
    };

    return { getBoard, addSign, clearBoard };
})();

class player {
    constructor(name, sign) {
        this._playerName = name;
        this.sign = sign;
    }
    
    get playerName() {
        return this._playerName;
    }

    set playerName(value) {
        this._playerName = value;
    }
}

const gameController = (() => {
    const board = gameboard;
    const playerOne = new player("Player 1", 1);
    const playerTwo = new player("Player 2", 2);
    let ai_opponent = false;
    let activePlayer = playerOne;
    let winState = -1;

    const switchActivePlayer = () => {
        activePlayer = (activePlayer === playerOne ? playerTwo : playerOne);
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    const getResult = () => {
        return winState;
    }

    const playAgainstAI = () => {
        ai_opponent = !ai_opponent;
    }

    const setPlayerName = (player, newName) => {
        if (player === 1) {
            playerOne.playerName = newName;
        } else if (player === 2) {
            playerTwo.playerName = newName;
        }
    }

    const playRound = (cellIndex) => {
        board.addSign(cellIndex, activePlayer);
        checkWinCondition();
        checkTieCondition();
        if (winState === -1) switchActivePlayer();
    }

    const aiTurn = () => {
        cellIndex = Math.floor(Math.random() * 9);
        currentBoard = board.getBoard();
        console.log(cellIndex);
        let row = Math.floor(cellIndex / 3);
        let col = cellIndex % 3;
        while (currentBoard[row][col] !== 0) {
            cellIndex = Math.floor(Math.random() * 9);
            row = Math.floor(cellIndex / 3);
            col = cellIndex % 3;
        }
        board.addSign(cellIndex, activePlayer);
        checkWinCondition();
        checkTieCondition();
        if (winState === -1) switchActivePlayer();
    }

    const checkWinCondition = () => {
        let boardArray = board.getBoard();
        for (let row of boardArray) {
            if (row[0] === 0) {
              continue; // Skip to the next iteration if the first condition is met.
            } else if (row[0] === row[1] && row[1] === row[2]) {
              winState = activePlayer.sign;
              break; // You can use break to exit the loop when the second condition is met.
            }
        }
        for (let col = 0; col < 3; col++) {
            if (boardArray[0][col] === 0) {
                continue;
            } else if (boardArray[0][col] === boardArray[1][col] && boardArray[1][col] === boardArray[2][col]) {
                winState = activePlayer.sign;
                break;
            }
        }
        if (boardArray[0][0] !== 0) {
            if (boardArray[0][0] === boardArray[1][1] && boardArray[1][1] === boardArray[2][2]) { winState = activePlayer.sign; }
        }
        if (boardArray[0][2] !== 0 && (boardArray[0][2] === boardArray[1][1] && boardArray[1][1] == boardArray[2][0])) {
            winState = activePlayer.sign;
        }
        return; 
    }

    const checkTieCondition = function() {
        const boardArray = board.getBoard();
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (boardArray[row][col] === 0) {
                    return;
                }
            }
        }
        if (winState !== 1 && winState !== 2) {
            winState = 0;
            console.log("set win state to tie");
        }
        return;
    }

    const printBoard = function() {
        return board.getBoard();
    }

    const newGame = function() {
        board.clearBoard();
        if (!ai_opponent) {
            switchActivePlayer();
        }
        winState = -1;
    }

    return { getActivePlayer, setPlayerName, playRound, getResult, newGame, printBoard, playAgainstAI, aiTurn };
})();

const ScreenController = () => {
    const game = gameController;
    const playerOneSign = `<svg viewBox="0 0 25 25" version="1.1" fill="#ffffff" stroke="#000000" data-darkreader-inline-stroke=""><g stroke-linecap="round" stroke-linejoin="round"></g> <g sketch:type="MSLayerGroup" transform="translate(-469.000000, -1041.000000)" fill="#000000" style="--darkreader-inline-fill: #000000;" data-darkreader-inline-fill=""> <path d="M487.148,1053.48 L492.813,1047.82 C494.376,1046.26 494.376,1043.72 492.813,1042.16 C491.248,1040.59 488.712,1040.59 487.148,1042.16 L481.484,1047.82 L475.82,1042.16 C474.257,1040.59 471.721,1040.59 470.156,1042.16 C468.593,1043.72 468.593,1046.26 470.156,1047.82 L475.82,1053.48 L470.156,1059.15 C468.593,1060.71 468.593,1063.25 470.156,1064.81 C471.721,1066.38 474.257,1066.38 475.82,1064.81 L481.484,1059.15 L487.148,1064.81 C488.712,1066.38 491.248,1066.38 492.813,1064.81 C494.376,1063.25 494.376,1060.71 492.813,1059.15 L487.148,1053.48" id="cross" sketch:type="MSShapeGroup"> </path></svg>`;
    const playerTwoSign = `<svg viewBox="0 0 24 24" fill="none" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const resultDiv = document.querySelector(".result");
    const newGame = document.getElementById("newgame");
    const playerOneName = document.getElementById("playerOneName");
    const playerTwoName = document.getElementById("playerTwoName");
    const aiOpponentSelected = document.querySelector('input[type="radio"][id="computer"]');
    const humanOpponent = document.querySelector('input[type="radio"][id="human"]');
    let aiOpponent = 0;
    const changePlayerOneName = function(value) {
        game.setPlayerName(1, value);
    };
    const changePlayerTwoName = function(value) {
        game.setPlayerName(2, value);
    };

    aiOpponentSelected.addEventListener("change", () => {
        console.log("changing opponent to ai");
        aiOpponent = 1;
        game.playAgainstAI();
        playerTwoName.disabled = true;
        game.newGame();
        console.log("opponent changed to ai");
    })

    humanOpponent.addEventListener("change", () => {
        aiOpponent = 0;
        game.playAgainstAI();
        playerTwoName.disabled = false;
        game.newGame();
    })

    document.addEventListener("DOMContentLoaded", () => {
        if (aiOpponentSelected.checked) {
            aiOpponent = 1;
            game.playAgainstAI();
            playerTwoName.disabled = true;
        }
    })

    const updateScreen = () => {
        changePlayerOneName(playerOneName.value);
        changePlayerTwoName(playerTwoName.value);
        boardDiv.textContent = "";
        const board = game.printBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.playerName}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                const index = rowIndex*3 + colIndex;
                cellButton.classList.add("cell");
                cellButton.dataset.index = index;
                if (cell === 1) {
                    cellButton.innerHTML = playerOneSign;
                } else if (cell === 2) {
                    cellButton.innerHTML = playerTwoSign;
                }
                boardDiv.appendChild(cellButton);
            })
        });

        if (game.getResult() === 1) {
            const result = `♔ ${activePlayer.playerName} ♔ wins!!!`;
            resultDiv.textContent = result;
            disableButtons();
            resultDiv.style.setProperty("--result-color", "rgb(14, 241, 14)");
        } else if (game.getResult() === 0) {
            const result = `Game ends in a tie ¯\\_(ツ)_/¯`;
            resultDiv.textContent = result;
            disableButtons();
            resultDiv.style.setProperty("--result-color", "#FFF500");
        } else if (game.getResult() === 2) {
            const result = `♔ ${activePlayer.playerName} ♔ wins!!!`;
            resultDiv.textContent = result;
            disableButtons();
            resultDiv.style.setProperty("--result-color", "rgb(241, 14, 14)")
        }
    }

    const disableButtons = function() {
        cells = document.querySelectorAll(".cell");
        cells.forEach((button) => {button.disabled = true;} )
    }

    const clickHandler = function(e) {
        const selectedCell = e.target.dataset.index;
        if (!selectedCell) return;
        
        game.playRound(selectedCell);
        if (aiOpponent && game.getResult() === -1) {
            game.aiTurn();
        } 
        updateScreen();
    }

    updateScreen();
    boardDiv.addEventListener("click", clickHandler);
    newGame.addEventListener("click", () => {
        game.newGame();
        resultDiv.innerHTML = "&nbsp;"; 
        updateScreen();
    });

    playerOneName.addEventListener("input", (event) => {
        changePlayerOneName(event.target.value);
        updateScreen();
    });
    playerTwoName.addEventListener("input", (event) => {
        changePlayerTwoName(event.target.value);
        updateScreen();
    });
    window.game = game;
};

ScreenController();