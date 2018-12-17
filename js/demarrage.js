const boardSize = 10;
const rangeLimit = 3;
const initialPower = 100;
const defaultDamage = 1; 
const obstaclesNumber = 15;
const weaponsNumber = 4;

$(document).ready(function () { 
	
	var myGame = new Game(); 
	myGame.init(boardSize, rangeLimit, initialPower, defaultDamage, obstaclesNumber, weaponsNumber); 

	var display = new Display(); 
	display.init(myGame); 
 
	var cycle = new Cycle(); 
	cycle.gameState(myGame, display);
	
  	}); 
