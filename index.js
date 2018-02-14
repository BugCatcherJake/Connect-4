//-----[Global Variables]-----//
//current position of cursor
var hover=0;
//whether the game is over
var gameOver;
//remember where the board pieces are
//0=none, 1=red(player), 2=blue(AI)
var value = new Array(7);
for (x=0;x<7;x++)
	value[x]=new Array(6);
//remembers how tall each column is
var height = new Array(7);

//------[AI Weights]-----//
//used to help the AI decide where to go
var weight = new Array(7);
	for (x=0;x<7;x++)
		weight[x]=new Array(6);
	
weight[0][0]=weight[6][0]=weight[6][5]=weight[0][5]=1;

weight[1][0]=weight[5][0]=weight[6][1]=weight[6][4]
=weight[5][5]=weight[1][5]=weight[0][4]=weight[0][1]=2;

weight[2][0]=weight[4][0]=weight[6][2]=weight[6][3]
=weight[4][5]=weight[2][5]=weight[0][3]=weight[0][2]=3;

weight[1][1]=weight[5][1]=weight[5][4]=weight[1][4]=4;	

weight[3][0]=weight[3][5]=5;

weight[2][1]=weight[4][1]=weight[5][2]=weight[5][3]
=weight[4][4]=weight[2][4]=weight[1][3]=weight[1][2]=6;

weight[3][1]=weight[3][4]=7;

weight[2][2]=weight[4][2]=weight[4][3]=weight[2][3]=8;

weight[3][2]=weight[3][3]=9;

//-----[Functions]-----//
function newGame(){
	gameOver=false;
	document.getElementById("log").innerHTML=" ";
	setBoard()
	for (x=0;x<7;x++){
		height[x]=0;
		for (y=0;y<6;y++){
			value[x][y]=0;
		}
	}
}

//Builds the board out of images
function setBoard(){
	var lattice=document.getElementById("lattice");
	lattice.innerHTML="";
	for (x=0;x<7;x++)
		lattice.innerHTML+="<img id="+x+"6 src=White.png "
			+"onmouseover=showPiece("+x+") onclick=dropPiece("+x+")>";
	lattice.innerHTML+="<br>";
	for (y=5;y>=0;y--){
		for (x=0;x<7;x++)
			lattice.innerHTML+="<img id="+x+y+" src=LatticeWhite.png "
			+"onmouseover=showPiece("+x+") onclick=dropPiece("+x+")>";
		lattice.innerHTML+="<br>";
	}
	
}

//Shows the current player position over the board
function showPiece(x){
	document.getElementById(hover+"6").src="White.png";
	document.getElementById(x+"6").src="Red.png";
	hover=x;
}

//Plays when the player tries to make a move
function dropPiece(x){
	if (height[x]!=6 && !gameOver){
		value[x][height[x]]=1;
		document.getElementById(""+x+height[x]).src="LatticeRed.png";
		checkWin();
		height[x]++;
		if (!gameOver)
			aiMove(x);
		checkWin();
	}
}

//AI decides where to go
function aiMove(){
	var bestMoveValue=0;
	var bestMovePos;

	//-----[Can the AI win, or block a win?]-----//
	for (x=0;x<7;x++){
		if (height[x]<6){
			//vertical
			if (height[x]>2){
				if (value[x][height[x]-1] == value[x][height[x]-2] &&
					value[x][height[x]-1] == value[x][height[x]-3]){
					aiWinOrBlock(value[x][height[x]-1],x);
				}
			}
			//horizontal and diagonal
			if (x<4){
				if (value[x+1][height[x]] != 0 &&
					value[x+1][height[x]] == value[x+2][height[x]] &&
					value[x+1][height[x]] == value[x+3][height[x]]){
					aiWinOrBlock(value[x+1][height[x]],x);
				}
				else if (height[x]<3){
					if (value[x+1][height[x]+1] != 0 &&
						value[x+1][height[x]+1] == value[x+2][height[x]+2] &&
						value[x+1][height[x]+1] == value[x+3][height[x]+3]){
						aiWinOrBlock(value[x+1][height[x]+1],x);
					}
				}
				else{
					if (value[x+1][height[x]-1] != 0 &&
						value[x+1][height[x]-1] == value[x+2][height[x]-2] &&
						value[x+1][height[x]-1] == value[x+3][height[x]-3]){
						aiWinOrBlock(value[x+1][height[x]-1],x);
					}
				}
			}
			if (x<5 && x>0){
				if (value[x-1][height[x]] != 0 &&
					value[x-1][height[x]] == value[x+1][height[x]] &&
					value[x-1][height[x]] == value[x+2][height[x]]){
					aiWinOrBlock(value[x-1][height[x]],x);
				}
				else{
					if (height[x]<4 && height[x]>0){
						if (value[x-1][height[x]-1] != 0 &&
							value[x-1][height[x]-1] == value[x+1][height[x]+1] &&
							value[x-1][height[x]-1] == value[x+2][height[x]+2]){
							aiWinOrBlock(value[x-1][height[x]-1],x);
						}
					}
					if (height[x]>1 && height[x]<5){
						if (value[x-1][height[x]+1] != 0 &&
							value[x-1][height[x]+1] == value[x+1][height[x]-1] &&
							value[x-1][height[x]+1] == value[x+2][height[x]-2]){
							aiWinOrBlock(value[x-1][height[x]+1],x);
						}
					}
				}			
			}
			if (x<6 && x>1){
				if (value[x-2][height[x]] != 0 &&
					value[x-2][height[x]] == value[x-1][height[x]] &&
					value[x-2][height[x]] == value[x+1][height[x]]){
					aiWinOrBlock(value[x-2][height[x]],x);
				}
				else{
					if (height[x]<5 && height[x]>1){
						if (value[x-2][height[x]-2] != 0 &&
							value[x-2][height[x]-2] == value[x-1][height[x]-1] &&
							value[x-2][height[x]-2] == value[x+1][height[x]+1]){
							aiWinOrBlock(value[x-2][height[x]-2],x);
						}
					}
					if (height[x]>0 && height[x]<4){
						if (value[x-2][height[x]+2] != 0 &&
							value[x-2][height[x]+2] == value[x-1][height[x]+1] &&
							value[x-2][height[x]+2] == value[x+1][height[x]-1]){
							aiWinOrBlock(value[x-2][height[x]+2],x);
						}
					}
				}
			}
			if (x>2){
				if (value[x-3][height[x]] != 0 &&
					value[x-3][height[x]] == value[x-2][height[x]] &&
					value[x-3][height[x]] == value[x-1][height[x]]){
					aiWinOrBlock(value[x-3][height[x]],x);
				}
				else if (height[x]>2){
					if (value[x-3][height[x]-3] != 0 &&
						value[x-3][height[x]-3] == value[x-2][height[x]-2] &&
						value[x-3][height[x]-3] == value[x-1][height[x]-1]){
						aiWinOrBlock(value[x-3][height[x]-3],x);
					}
				}
				else{
					if (value[x-3][height[x]+3] != 0 &&
						value[x-3][height[x]+3] == value[x-2][height[x]+2] &&
						value[x-3][height[x]+3] == value[x-1][height[x]+1]){
						aiWinOrBlock(value[x-3][height[x]+3],x);
					}
				}
			}
		}
	}
	//-----[Special Cases]-----//
	//These preempt some errors that the computer can make in the early stages
	if (value[3][0] == 1){
		if (value[2][0] == 1 && value[4][0] == 0 && value[0][0] == 0){
			bestMoveValue=10;
			bestMovePos=4;
		}
		else if (value[2][0] == 0){
			if (value[4][0] == 1 && value[6][0] == 0){
				bestMoveValue=10;
				bestMovePos=2;
			}
			else if (value[4][0] == 0){
				if (value[1][0] == 1){
					bestMoveValue=10;
					bestMovePos=2;
				}
				else if (value[5][0] == 1){
					bestMoveValue=10;
					bestMovePos=4;
				}
			}
		}
	}
	else if (value[3][0] == 0 &&
		((value[2][0] == 1 && value[1][0] == 1) ||
		(value[4][0] == 1 && value[5][0] == 1) ||
		(value[2][0] == 1 && value[4][0] == 1))){
		bestMoveValue=10;
		bestMovePos=3;
	}
	//-----[Perform Regular Move]-----//
	for (x=0;x<7;x++)
		if (weight[x][height[x]]>bestMoveValue){
			bestMoveValue=weight[x][height[x]];
			bestMovePos=x;
		}
	document.getElementById("log").innerHTML="Debug: "+bestMoveValue;
	value[bestMovePos][height[bestMovePos]]=2;
	document.getElementById(""+bestMovePos+height[bestMovePos]).src="LatticeBlue.png";
	height[bestMovePos]++;
	
	//-----[Extra AI Functions]-----//
	function aiWinOrBlock(p,x){
		if (p==2){
			bestMovePos=x;
			bestMoveValue=12;
		}
		else if (bestMoveValue<12){
			bestMovePos=x;
			bestMoveValue=11;
		}
	}
}

function checkWin(){
	//horizontal
	for (x=0;x<4;x++)
		for(y=0;y<6;y++)
			if (value[x][y]!=0
				&& value[x][y]==value[x+1][y]
				&& value[x][y]==value[x+2][y]
				&& value[x][y]==value[x+3][y])
				win(value[x][y]);
	//vertical
	for (x=0;x<7;x++)
		for(y=0;y<3;y++)
			if (value[x][y]!=0
				&& value[x][y]==value[x][y+1]
				&& value[x][y]==value[x][y+2]
				&& value[x][y]==value[x][y+3])
				win(value[x][y]);
	//diagonal up
	for (x=0;x<4;x++)
		for(y=0;y<3;y++)
			if (value[x][y]!=0
				&& value[x][y]==value[x+1][y+1]
				&& value[x][y]==value[x+2][y+2]
				&& value[x][y]==value[x+3][y+3])
				win(value[x][y]);
	//diagonal down
	for (x=0;x<4;x++)
		for(y=3;y<6;y++)
			if (value[x][y]!=0
				&& value[x][y]==value[x+1][y-1]
				&& value[x][y]==value[x+2][y-2]
				&& value[x][y]==value[x+3][y-3])
				win(value[x][y]);
	if (!gameOver && height[0] == 6 &&
		height[1] == 6 && height[2] == 6 &&
		height[3] == 6 && height[4] == 6 &&
		height[5] == 6 && height[6] == 6){
		gameOver=true;
		document.getElementById("log").innerHTML="Tie Game";
	}
}

function win(p){
	gameOver=true;
	document.getElementById("log").innerHTML="Player "+p+" wins";
}