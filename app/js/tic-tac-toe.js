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
            const mess = document.getElementById('cell-message');
            mess.textContent = 'This cell is already taken!';
            mess.style.display = 'block';
            mess.addEventListener('animationend', () => {
                mess.style.display = 'none';
            });
        }
    }
    const checkWin = () => {
        const game_board = document.querySelector('.game-board');
        let board = gameBoard.getBoard();
        const checkRow = () => {
            for (let i = 0; i < board.length; i++) {
                if(board[x][i] != getActivePlayer()) {
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
        const draw = () => {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    if(board[i][j] == "-") {
                        return false;
                    }
                    if(i == board.length - 1 && j == board.length - 1){
                        return true;
                    }
                }
            }
        }

        if(checkRow() == true || checkColumn() == true || firstDiag() == true || secondDiag() == true) {
            const winMessage = document.getElementById('win-message');
            winMessage.style.display = 'block';
            winMessage.textContent = `Player: ${getActivePlayer()} Wins`;
        }
        else if(draw() == true) {
            const winMessage = document.getElementById('win-message');
            winMessage.style.display = 'block';
            winMessage.textContent = `Draw!`;
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
    const restart_btn = document.getElementById('restart-btn');
    const mess = document.getElementById('win-message');
    let active_player = document.querySelector('#active-player-text'); 

    //Function for updating DOM board
    const updateScreen = () => {
        game_board.textContent = "";
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
        if(mess.style.display == 'block') {
            game_board.removeEventListener('click', clickHandlerBoard);
            ClassesHandeler();
        }
        else {
            game_board.addEventListener('click', clickHandlerBoard);
        }
    }
    //What happens when we click on a button from a board
    function clickHandlerBoard(e) {
        if(e.target.classList.contains('game-cell')) {
            x = e.target.dataset.row;
            y = e.target.dataset.cell;
            gameEngine.newRound(x, y);
            updateScreen();
        } else {
            console.log("Click on a board! O_O");
        }
    }

    function ClassesHandeler() {
        const gameCells = document.querySelectorAll('.game-cell');
        gameCells.forEach((cell) => {
            if(cell.classList.contains('game-cell')) {
                cell.classList.add('game-cell-end');
                cell.classList.remove('game-cell');
            }
            else {
                cell.classList.remove('game-cell-end');
                cell.classList.add('game-cell');
            }
        });
    }

    function restartGame() {
        const winMessage = document.getElementById('win-message');
        winMessage.style.display = 'none';
        gameBoard.generateBoard();
        ClassesHandeler();
        updateScreen();
    }

    //Adding eventlistener for game board
    game_board.addEventListener('click', clickHandlerBoard);
    restart_btn.addEventListener('click', restartGame);

    //Initializing board for the first time into the DOM
    updateScreen();
}

//Just calling function to start a game - gameEngine handles game logic
displayController();