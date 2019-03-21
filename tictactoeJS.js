//function that start live camera feed
window.onload = function() {

  // Normalize the various vendor prefixed versions of getUserMedia.
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia);

  if (navigator.getUserMedia) {
  // Request the camera.
  navigator.getUserMedia(
    // Constraints
    {
      video: true
    },

    // Success Callback
    function(localMediaStream) {

    },

    // Error Callback
    function(err) {
      // Log the error to the console.
      console.log('The following error occurred when trying to use getUserMedia: ' + err);
    }
  );

	} else {
	  alert('Sorry, your browser does not support getUserMedia');
	}

	// Get a reference to the video element on the page.
	var vid = document.getElementById('camera-stream');

	// Create an object URL for the video stream and use this 
	// to set the video source.
	vid.src = window.URL.createObjectURL(localMediaStream);

	}

//the values for the players
var humanPlayer = "X";
var aiPlayer = "O";

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
	for(var x = 0; x < 3; x++){
		//for each column
		for(var y = 0; y < 3; y++){
			document.getElementById(x + '_' + y).value = ' ';
		}
	}
}

//write x or o depending on whose turn it is
function squareClicked(square){
	if(gameOver){
		alert("The game is already over.");
		return;
	}
	var status = document.getElementById('status');
	var value = square.value;
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
			status.innerHTML = "X\'s turn"
		}
	}else{
		alert('That square has already been played.');
		numMoves--;
	}

	var winner = checkWin();
	if(numMoves == 9){
		if(!winner)
			status.innerHTMl = 'Tie Game';
		gameOver = true;
	}	
}

function checkWin(){
	var status = document.getElementById('status');

	var val0;
	var val1;
	var val2;

	//check columns
	for(var y = 0; y < 3; y++){
		val0 = document.getElementById('0_' + y).value;
		val1 = document.getElementById('1_' + y).value;
		val2 = document.getElementById('2_' + y).value;

		if(val0 == 'X' && val1 == 'X' && val2 == 'X'){
			status.innerHTML = "X Wins!";
			return true;
		}else if (val0 == 'O' && val1 == 'O' && val2 == 'O'){
			status.innerHTML = "O Wins!";
			return true;
		}
	}

	//check rows
	for(var x = 0; x < 3; x++){
		val0 = document.getElementById(x + '_0').value;
		val1 = document.getElementById(x + '_1').value;
		val2 = document.getElementById(x + '_2').value;

		if(val0 == 'X' && val1 == 'X' && val2 == 'X'){
			status.innerHTML = "X Wins!";
			return true;
		}else if (val0 == 'O' && val1 == 'O' && val2 == 'O'){
			status.innerHTML = "O Wins!";
			return true;
		}
	}

	//check diagonals
	val0 = document.getElementById('0_0').value;
	val1 = document.getElementById('1_1').value;
	val2 = document.getElementById('2_2').value;

	if(val0 == 'X' && val1 == 'X' && val2 == 'X'){
		status.innerHTML = "X Wins!";
		return true;
	}else if (val0 == 'O' && val1 == 'O' && val2 == 'O'){
		status.innerHTML = "O Wins!";
		return true;
	}

	//check diagonals
	val0 = document.getElementById('2_0').value;
	val1 = document.getElementById('1_1').value;
	val2 = document.getElementById('0_2').value;

	if(val0 == 'X' && val1 == 'X' && val2 == 'X'){
		status.innerHTML = "X Wins!";
		return true;
	}else if (val0 == 'O' && val1 == 'O' && val2 == 'O'){
		status.innerHTML = "O Wins!";
		return true;
	}

	//no winner yet
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


// function int tictactoe(button){

// }
