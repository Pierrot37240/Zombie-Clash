			
// ---------- Game cycle -------------------------------------------			

			
var Cycle = function (gameObject, displayObject) {
	this.playerTurn = function (gameObject, player, displayObject){
		//faire bouger le joueur actif
		displayObject.playerMoves(gameObject, player, displayObject);
		var adjacent = (distance(player.x, player.y, gameObject.getOpponnent(player).x, gameObject.getOpponnent(player).y) < 2);
		//si les joueurs sont adjacents et que le combat n'a pas déjà démarré
		if (adjacent && (!gameObject.battleModeState)) {
			//si le joueur 1 vient de jouer
			if (gameObject.state === gameObject.states.PLAYERONE_TURN){
				/*lancement du combat pour le joueur opposé :
				par souci d'équité on commence par le joueur opposé, 
				sinon le joueur actif pourrait commencer le combat dès le premier
				tour et gagner à chaque fois
				*/
					return gameObject.states.PLAYERTWO_BATTLEMODE;
			} else {
					return gameObject.states.PLAYERONE_BATTLEMODE;
			};
		};

		//sans combat, on change le joueur actif
		if (gameObject.state === gameObject.states.PLAYERONE_TURN) {
			return gameObject.states.PLAYERTWO_TURN;
		} else {
			return gameObject.states.PLAYERONE_TURN;
		};
	};
			
			
	this.decision = function (gameObject, player, decision) {
	if (!gameObject.battleModeState) {
		gameObject.updateBattleModeState(gameObject.battleModeStates.ON);
		player.updateBattleMode(decision);
		if (gameObject.state === gameObject.states.PLAYERONE_BATTLEMODE){
			return gameObject.states.PLAYERTWO_BATTLEMODE;
		} else {
			return gameObject.states.PLAYERONE_BATTLEMODE;
		}
	} else if (gameObject.battleModeState) {
		player.updateBattleMode(decision);
		gameObject.actionBattle(gameObject.playerOne, gameObject.playerTwo);
		gameObject.updateBattleModeState(gameObject.battleModeStates.OFF);
		if (gameObject.playerOne.power <= 0 || gameObject.playerTwo.power <= 0) {
			return gameObject.states.GAMEOVER;
		}
		if (gameObject.state === gameObject.states.PLAYERONE_BATTLEMODE){
			return gameObject.states.PLAYERTWO_TURN;
		} else {
			return gameObject.states.PLAYERONE_TURN;
		}
	};
};
	
			
this.restart = function (gameObject, displayObject) {
	gameObject.restart();
	displayObject.init(gameObject);
};


this.hunt = function (gameObject, player, displayObject, handle) {
	// TODO : créer mise à jour infos jeu	
	//Garder l'ordre des paramètes sinon playerOne et playerTwo s'inverseraient 1 fois sur 2		
	//displayObject.updateGameInformation(gameObject.playerOne, gameObject.playerTwo, gameObject);						
								
	$(window).on('click', function (event) {
		var clickTarget = $(event.target).parents('div:eq(1)').attr('id');
		clickTarget = clickTarget.replace("field-", "").split("");
		clickTarget = [parseInt(clickTarget[0]), parseInt(clickTarget[1])];
		if (isInArray(clickTarget, player.possibleMoves)) {
				/* Alimenter 'path' avec une liste incluant les coordonnées entre la position du joueur et
				et sa destination*/
				displayObject.makePath(player, clickTarget);
				gameObject.updateState(handle.playerTurn(gameObject, player, displayObject));
			}
		$(window).off('click');
		handle.gameState(gameObject, displayObject);
	});
}		


this.fight = function (gameObject, player, displayObject, handle){
	//displayObject.updateGameInformation(gameObject.playerOne, gameObject.playerTwo, gameObject);						
	displayObject.hidePlayerRange(player);
	//displayObject.showPlayerRange(opponent);
	gameObject.updateState(handle.decision(gameObject, player, gameObject.decisions.ATTACK));		
	handle.gameState(gameObject, displayObject);
}


this.gameState = function (gameObject, displayObject) {
	// Reset event listeners			
	//$(window).off();
						
	// Ajout listener pour bouton Restart à créer			
	/*displayObject.buttonRestart.on('click', function () {
		// Réinitialiser le jeu		
		handle.restart(gameObject, displayObject);
		gameObject.updateState(gameObject.states.START);
		handle.gameState(gameObject, displayObject);
	});*/
				
	var handle = this;
				
	switch (gameObject.state) {		
		case gameObject.states.START:			
			gameObject.updateState(gameObject.states.PLAYERONE_TURN	);			
			handle.gameState(gameObject, displayObject);
		break;
						
		case gameObject.states.PLAYERONE_TURN:
			handle.hunt(gameObject, gameObject.playerOne, displayObject, handle);
		break;
						
		case gameObject.states.PLAYERTWO_TURN:
			handle.hunt(gameObject, gameObject.playerTwo, displayObject, handle);
		break;
								
		case gameObject.states.PLAYERONE_BATTLEMODE:
			handle.fight(gameObject, gameObject.playerOne, displayObject, handle);
		break;

		case gameObject.states.PLAYERTWO_BATTLEMODE:
			handle.fight(gameObject, gameObject.playerTwo, displayObject, handle);
		break;
					
					
	//  Game Over			
	case gameObject.states.GAMEOVER:
		//displayObject.updateGameInformation(gameObject.playerOne, gameObject.playerTwo, gameObject);
							
		// Victoire joueur 1	
		if (gameObject.playerOne.power > 0 && gameObject.playerTwo.power <= 0) {
			displayObject.modal.gameOverShow(gameObject.gameOverStates.PLAYERONE_WINS, gameObject.gameOverStates, displayObject);			
		}
		// Victoire joueur 2
		else if (gameObject.playerOne.power <= 0 && gameObject.playerTwo.power > 0) {
			displayObject.modal.gameOverShow(gameObject.gameOverStates.PLAYERTWO_WINS, gameObject.gameOverStates, displayObject);
		}
		// Match nul
		else if (gameObject.playerOne.power <= 0 && gameObject.playerTwo.power <= 0) {
			displayObject.modal.gameOverShow(gameObject.gameOverStates.DRAW, gameObject.gameOverStates, displayObject);
		}
		// Partie interrompue
		else {
			displayObject.modal.gameOverShow('', gameObject.gameOverStates);
		}
				
				
		$(window).keydown(function (event) {
			if (event.key === 'Enter') {
				handle.restart(gameObject, displayObject);
				gameObject.updateState(gameObject.states.PLAYERONE_TURN);
				}
			handle.gameState(gameObject, displayObject);
			});
		break;
		default:
		}
	};
};