//the values for the players
var humanPlayer = "X";
var aiPlayer = "O";

//variable that tells program whether or not its an ai game.
var aiGame = false;

//a variable that tells the program that it is X's turn
var turn = true;

//a variable that tells the program when the game is over
var gameOver = false;

//a variable that tells the program how many moves have been made so far
var numMoves = 0;

//starts a new game
function newGame(){
	gameOver = false;
	numMoves = 0;
	var status = document.getElementById('status');
	turn = true;
	status.innerHTML = 'X \'s turn';

	//clearing the board
	//for each row
	for(var x = 0; x < 9; x++){
			document.getElementById(x).value = ' ';
	}
}

//write x or o depending on whose turn it is
function squareClicked(square){
	var winner = checkWin();

	//if the game is over or if there is a winner....
	if(gameOver||winner){
		alert("The game is already over.");
		return;
	}

	var status = document.getElementById('status');
	var value = square.value;
	
	if(numMoves == 9 && winner == false){
		status.innerHTML = "Tie Game";
		gameOver = true;
	}

	//if the game is artificial
	if(aiGame){
		if(value != 'X' && value != 'O'){	
			square.value = 'X';	
			var board = convert();	
			//get the artificial intelligence's next move
			var index = minimax(board, aiPlayer).index;
			//play that move on the board
			document.getElementById(index).value = aiPlayer;
			status.innerHTML = "X\'s turn";
			numMoves = numMoves + 2;
		}
		else{
			alert('That square has already been played.');
		}

		var winner = checkWin();
		if(numMoves == 9){
			if(!winner)
				status.innerHTMl = 'Tie Game';
			gameOver = true;
		}	
	//else if its human vs human
	}else{
		if(value != 'X' && value != 'O'){
			if(turn){
				numMoves++;
				square.value = 'X';
				turn = false;
				status.innerHTML = "O\'s turn";
			}else{
				numMoves++;
				square.value = 'O';
				turn = true;
				status.innerHTML = "X\'s turn";
		}
		}else{
			alert('That square has already been played.');
		}

		var winner = checkWin();
		if(numMoves == 9){
			if(!winner){
				status.innerHTMl = 'Tie Game';
			}
			gameOver = true;
		}	

	}

	
}

//function that checks whether someone has won or not.
function checkWin(){
	var status = document.getElementById('status');

	//get the array representation of the board
	var board = convert();

	var humanWinner = winning(board, humanPlayer);
	var opponentWinner = winning(board, aiPlayer);

	//if X wins
	if(humanWinner){
		status.innerHTML = "X Wins!";
		return true;
	//if O wins
	}else if(opponentWinner){
		status.innerHTML = "O Wins!";
		return true;
	}else
		return false;
}

//a function that returns an array with the boxes that are empty
function emptyBoxes(board){
	//check the array for any boxes that dont have X or O
	return board.filter(s => s != "O" && s != "X");
}

//function that holds all the winning combinations for a tic tac toe game
function winning(board, player){
	if(
		(board[0] == player && board[1] == player && board[2] == player)||
		(board[3] == player && board[4] == player && board[5] == player)||
		(board[6] == player && board[7] == player && board[8] == player)||
		(board[0] == player && board[3] == player && board[6] == player)||
		(board[1] == player && board[4] == player && board[7] == player)||
		(board[2] == player && board[5] == player && board[8] == player)||
		(board[0] == player && board[4] == player && board[8] == player)||
		(board[2] == player && board[4] == player && board[6] == player)){
		return true;
	}else{
		return false;
	}
}

//the artificial intelligent function that takes in a board in its original
//state and the player whose turn it is
function minimax(newBoard, player){
	//this is an array that holds the empty boxes on the board
	var availableBlocks = emptyBoxes(newBoard);

	//an array of moves
	var moves = [];

	//checking for the terminal states and assigning scores to those states
	if(winning(newBoard, humanPlayer)){
		return {score: -10};
	}else if(winning(newBoard, aiPlayer)){
		return {score: 10};
	}else if (availableBlocks.length == 0){
		return{score: 0};
	}

	//loop through the available spots and run minimax on those spots
	//it will create moves and store a potential score
	for(var i = 0; i < availableBlocks.length; i++){
		//create a move object
		var move = {};
		//the index of that move object is the index of the available block
		move.index = newBoard[availableBlocks[i]];
		//the curent player is assigned to that available block
		newBoard[availableBlocks[i]] = player;

		if(player == aiPlayer){
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		}else{
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		//reset the spot to empty
		newBoard[availableBlocks[i]] = move.index;

		//push the object to the array
		moves.push(move);
	}

	//--------------------------------------------------------
	var bestMove;
	if(player == aiPlayer){
		var bestScore = -1000;
		for(var i = 0; i< moves.length; i++){
			if(moves[i].score > bestScore){
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}else{
		var bestScore = 1000;
		for(var i = 0; i < moves.length; i++){
			if(moves[i].score < bestScore){
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

//a function that converts the board into an array
function convert(){
	var board = [];
	for(var i = 0; i < 9; i++){

		var button = document.getElementById(i).value;

		if(button == " "){
			board.push(i);
		}else{
			board.push(button);
		}	
	}
	return board;
}

//starting an AI Game
function artificialGame(){
	var table = document.getElementById("layout");
	table.style.backgroundColor = "rgba(153, 0, 153, .40)";
	table.style.color = "white";
	var gameType = document.getElementById("type");
	type.innerHTML = "Artificial Tic Tac Toe";

	var opponentPic = document.getElementById("opponentPic");
	opponentPic.src = "robot3.png";

	var opponentName = document.getElementById("opponentName");
	opponentName.innerHTML = "Robot";

	newGame();

	aiGame = true;
}

//Starting a human vs human game
function humanGame(){
	var table = document.getElementById("layout");
	table.style.backgroundColor = "black";
	table.style.color = "green";
	var gameType = document.getElementById("type");
	type.innerHTML = "Human Tic Tac Toe";

	var opponentPic = document.getElementById("opponentPic");
	opponentPic.src = "student.png";

	var opponentName = document.getElementById("opponentName");
	opponentName.innerHTML = "Opponent";

	newGame();

	aiGame = false;
}
