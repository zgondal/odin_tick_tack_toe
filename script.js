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
        const row = index / 3;
        const col = index % 3;
        if (board[row][col] !== 0) {
            return undefined;
        } else {
            board[row][col] = player.sign;
        }
    }
    
    const clearBoard = () => {
        board.forEach(row => {row.forEach((cellValue) => {
            cellValue = 0;
        });
    })
    }

    return { getBoard, addSign, clearBoard };
})();

const player = (playerName, playerSign) => {
    let playerName = playerName;
    const sign = playerSign;

    const setName = (newName) => {
        playerName = newName;
    };

    return {playerName, sign, setName};
}

const gameController = (() => {
    const board = gameboard;
    const playerOne = player("Player 1", 1);
    const playerTwo = player("Player 2", 2);
    let activePlayer = playerOne;
    let winState = false;
    let isTie = false;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    const setPlayerName = (player, newName) => {
        if (player === 1) {
            playerOne.setName(newName);
        } else if (player === 2) {
            playerTwo.setName(newName);
        }
    }

    const playRound = (cellIndex) => {
        const row = cellIndex / 3;
        const col = cellIndex % 3;

        if (board.addSign(cellIndex, activePlayer) === undefined) return;
        else {
            board.addSign(cellIndex, activePlayer);
            switchActivePlayer;
        }
        checkWinCondition();
        checkTieCondition();
    }

    const checkWinCondition = () => {
        let boardArray = board.getBoard();
        for (let row of boardArray) {
            if (row[0] === 0) {
              continue; // Skip to the next iteration if the first condition is met.
            } else if (row[0] === row[1] && row[1] === row[2]) {
              winState = true;
              break; // You can use break to exit the loop when the second condition is met.
            }
        }
        for (let col = 0; col < 3; col++) {
            if (boardArray[0][col] === 0) {
                continue;
            } else if (boardArray[0][col] === boardArray[1][col] && boardArray[1][col] === boardArray[2][col]) {
                winState = true;
                break;
            }
        }
        if (boardArray[0][0] !== 0) {
            if (boardArray[0][0] === boardArray[1][1] && boardArray[1][1] === boardArray[2][2]) { winState = true; }
        }
        if (boardArray[0][2] !== 0 && (boardArray[0][2] === boardArray[1][1] && boardArray[1][1] == boardArray[2][0])) {
            winState = true;
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
        if (!winState) isTie = true;
        return;
    }

    const printBoard = function() {
        return board.getBoard();
    }

    const newGame = function() {
        board.clearBoard();
        switchActivePlayer();
    }

    return { getActivePlayer, setPlayerName, playRound, winState, newGame, printBoard, isTie};
})();

const ScreenController = function() {
    const game = gameController;
    const playerOneSign = `<svg viewBox="0 0 25 25" version="1.1" fill="#ffffff" style="--darkreader-inline-fill: #000000; --darkreader-inline-stroke: #e8e6e3;" data-darkreader-inline-fill="" stroke="#ffffff" data-darkreader-inline-stroke=""><g stroke-linecap="round" stroke-linejoin="round"></g> <g sketch:type="MSLayerGroup" transform="translate(-469.000000, -1041.000000)" fill="#000000" style="--darkreader-inline-fill: #000000;" data-darkreader-inline-fill=""> <path d="M487.148,1053.48 L492.813,1047.82 C494.376,1046.26 494.376,1043.72 492.813,1042.16 C491.248,1040.59 488.712,1040.59 487.148,1042.16 L481.484,1047.82 L475.82,1042.16 C474.257,1040.59 471.721,1040.59 470.156,1042.16 C468.593,1043.72 468.593,1046.26 470.156,1047.82 L475.82,1053.48 L470.156,1059.15 C468.593,1060.71 468.593,1063.25 470.156,1064.81 C471.721,1066.38 474.257,1066.38 475.82,1064.81 L481.484,1059.15 L487.148,1064.81 C488.712,1066.38 491.248,1066.38 492.813,1064.81 C494.376,1063.25 494.376,1060.71 492.813,1059.15 L487.148,1053.48" id="cross" sketch:type="MSShapeGroup"> </path></svg>`;
    const playerTwoSign = `<svg fill="#ffffff" viewBox="0 0 25 25" version="1.1"><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><path d="M150,0C67.29,0,0,67.29,0,150s67.29,150,150,150s150-67.29,150-150S232.71,0,150,0z M150,270c-66.169,0-120-53.832-120-120 S83.831,30,150,30s120,53.832,120,120S216.168,270,150,270z"></path></svg>`;
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const resultDiv = document.querySelector(".result");
    const newGame = document.getElementById("newgame");
    const playerOneName = document.getElementById("playerOneName").value;
    const playerTwoName = document.getElementById("playerTwoName").value;

    game.setPlayerName(1, playerOneName);
    game.setPlayerName(2, playerTwoName);

    const updateScreen = function() {
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
        })

        if (game.winState) {
            const result = `${activePlayer.playerName} wins!!!`;
            resultDiv.textContent = result;
        } else if (game.isTie) {
            const result = `Game ends in a tie ¯\\_(ツ)_/¯`;
            resultDiv.textContent = result;
        }
    }

    const clickHandler = function(e) {
        const selectedCell = e.target.dataset.index;
        
        if (!selectedCell) return;
        
        game.playRound(selectedCell);
        updateScreen();
    }



}