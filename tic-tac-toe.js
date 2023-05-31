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
        if(checkMove(x, y) == true){
            board[x][y] = symbol;
        }
        else {
            console.log('Illegal Move');
        }
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
    
    return { getBoard, makeMove, generateBoard }
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
        activePlayer.makeMove(x, y, getActivePlayer());
        switchPlayers();
    }
    const getActivePlayer = () => activePlayer.getSymbol();

    const { printBoard } = gameBoard;
    return { newRound, printBoard, switchPlayers, getActivePlayer }
})();

//Function for updating and displaying board into the DOM
function displayController() {
    //Initializing of elements I will use for modifycation
    const game_board = document.querySelector('.game-board');
    const board = gameBoard.getBoard();
    let active_player = document.querySelector('#active-player-text'); 

    //Function for updating DOM board
    const updateScreen = () => {
        active_player.textContent = `It's Player'${gameEngine.getActivePlayer()} turn`;
        board.forEach((row, row_index) => {
            const game_row = document.createElement('section');
            game_row.classList.add('game-row');
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
            console.log("seš dement");
        }
    }

    //Adding eventlistener for game board
    game_board.addEventListener('click', clickHandlerBoard);

    //Initializing board for the first time into the DOM
    updateScreen();
}

//Just calling function to start a game - gameEngine handles game logic
displayController();