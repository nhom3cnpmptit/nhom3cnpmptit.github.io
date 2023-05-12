
const X = 1, O = 2, Empty = 0;


var currGame = new game(16, 16);
board.writeBoard();


function game(noOfRow, noOfCol) {
	this.noOfRow = noOfRow, this.noOfCol = noOfCol;
	this.Turn = X;
	this.isGamming = true; //currGame.isGamming or Not.
	this.noOfPiece = 0; //number of Pieces on the table -> to check draw
	this.sq = new Array(); /* define an array storing XO position */
	for (var i = 0; i < this.noOfRow; i++) {
		this.sq[i] = new Array();
		for (var j = 0; j < this.noOfCol; j++) {
			this.sq[i][j]=0;
		}
	}
	this.sq[7][7] = X;
	this.sq[7][8] = O;
	this.sq[8][8] = X;
	this.sq[8][7] = O;
	this.xMove = function(i,j){
		currGame.sq[i][j] = X;
		board.sqUpdate(i, j);
		currGame.noOfPiece++;
		currGame.Turn = O;
		referee.checkWin()
		if (currGame.isGamming == false){
			return;
		}
		var bestMove = {row:0, col:0};
		AIthink(O, bestMove);
		currGame.sq[bestMove.row][bestMove.col] = O;
		board.sqUpdate(bestMove.row, bestMove.col);
		currGame.Turn = X;
		currGame.noOfPiece++;
		referee.checkWin()
	};
}

