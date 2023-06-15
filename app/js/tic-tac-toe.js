//GameBoard Initialization
const gameBoard = (() => {
    let board = [];
    const generateBoard = () => {
        for (let i = 0; i < 3; i++) 
        {
            let array = [];
            for (let j = 0; j < 3; j++) 
            {
                array[j] = '-';
            }
            board[i] = array;  
        }    
    }
    const makeMove = (x, y, symbol) => {
            board[x][y] = symbol; 
    }
    const checkMove = (x, y) => {
        if(board[x][y] == '-') {
            return true;
        }
        else {
            return false;
        }
    }
    const getBoard = () => board;
    return { getBoard, makeMove, generateBoard, checkMove }
})();

//Player object
const Player = (symbol) => {
    const { makeMove } = gameBoard;
    const getSymbol = () => symbol;
    return { makeMove, getSymbol }
}

//GameEngine initialization
const gameEngine = (() => {
    const playerX = Player('X');
    const playerO = Player('O');
    let activePlayer = playerO;
    gameBoard.generateBoard();

    const switchPlayers = () => {
        activePlayer == playerX ? activePlayer = playerO : activePlayer = playerX;
    }
    const newRound = (x, y) => {
        if(gameBoard.checkMove(x, y)) {
            activePlayer.makeMove(x, y, getActivePlayer());
            checkWin();
            switchPlayers();
        }
        else {
            console.log('Illegal move');
        }
    }
    const checkWin = () => {
        let board = gameBoard.getBoard();
        const checkRow = () => {
            for (let i = 0; i < board.length; i++) {
                if(gameBoard.getBoard()[x][i] != getActivePlayer()) {
                    break;
                }
                if(i == board.length - 1){
                    return true;
                }
            }
        }
        const checkColumn = () => {
            for (let i = 0; i < board.length; i++) {
                if(board[i][y] != getActivePlayer()) {
                    break;
                }
                if(i == board.length - 1){
                    return true;
                }
            } 
        }  
        const firstDiag = () => {
            for (let i = 0; i < board.length; i++) {
                if(board[i][i] != getActivePlayer()) {
                    break;
                }
                if(i == board.length - 1) {
                    return true;
                }
            }
        }
        const secondDiag = () => {
            for (let i = 0; i < board.length; i++) {
                if((board[(board.length - 1) - i][i]) != getActivePlayer()) {
                    break;
                }
                if(i == board.length - 1) {
                    return true;
                }
            }
        }
        if(checkRow() == true || checkColumn() == true || firstDiag() == true || secondDiag() == true) {
            console.log("vyhrál: " + getActivePlayer());
        }
    }
    const getActivePlayer = () => activePlayer.getSymbol();
    return { newRound, switchPlayers, getActivePlayer }
})();

//Function for updating and displaying board into the DOM
function displayController() {
    //Initializing of elements I will use for modification
    const game_board = document.querySelector('.game-board');
    const board = gameBoard.getBoard();
    let active_player = document.querySelector('#active-player-text'); 

    //Function for updating DOM board
    const updateScreen = () => {
        active_player.textContent = `It's Player'${gameEngine.getActivePlayer()} turn`;
        board.forEach((row, row_index) => {
            const game_row = document.createElement('div');
            game_row.classList.add('game-column');
            game_board.appendChild(game_row);
            row.forEach((cell, cell_index) => {
                const game_cell = document.createElement('button');
                game_cell.classList.add('game-cell');
                game_cell.textContent = cell;
                game_cell.dataset.row = row_index;
                game_cell.dataset.cell = cell_index;
                game_row.appendChild(game_cell);
            });
        });
    }
     
    //What happens when we click on a button from a board
    function clickHandlerBoard(e) {
        if(e.target.classList.contains('game-cell')) {
            game_board.textContent = "";
            x = e.target.dataset.row;
            y = e.target.dataset.cell;
            gameEngine.newRound(x, y);
            updateScreen();
        } else {
            console.log("Click on a board! O_O");
        }
    }

    //Adding eventlistener for game board
    game_board.addEventListener('click', clickHandlerBoard);

    //Initializing board for the first time into the DOM
    updateScreen();
}

//Just calling function to start a game - gameEngine handles game logic
displayController();