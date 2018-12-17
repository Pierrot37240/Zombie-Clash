 
//	---------- object Jeu----------------------------------------------------

var Game = function () {
	this.init = function (boardSize, rangeLimit, initialPower, defaultDamage, obstaclesNumber, weaponsNumber) {
		// Santé initiale
		this.initialPower = initialPower || 100;
		
		// Compteur de tours
		this.turnCounter = 0;
		
		// Initialiser le plateau de jeu
		this.board = new Board();
		this.board.init(boardSize);

		this.defaultWeapon = new Weapon(defaultDamage, 'default');
		
		// Génère une liste aléatoire de coordonnées pour les objets à placer sur le plateau

		//-----INFO-----\\
		//The splice() method changes the contents of an array by removing existing elements and/or adding new elements.

		var randXYList = this.randomFieldList(2 + obstaclesNumber + weaponsNumber);

		this.playerOne = new Player();
		this.playerOne.init(randXYList[0], rangeLimit, this.initialPower, this.defaultWeapon, 'playerOne');

		this.playerTwo = new Player();
		for(var i = randXYList.length - 1; i >= 0; i--) {
		    if(distance(randXYList[0][0], randXYList[0][1], randXYList[i][0], randXYList[i][1]) > 3) {
		       this.playerTwo.init(randXYList[i], rangeLimit, this.initialPower, this.defaultWeapon, 'playerTwo');
		       randXYList.splice(i, 1);
		       randXYList.splice(0, 1);
		       break;
		    }
		};
		
		// Définit le tableau de coordonnées pour les obstacles
		this.obstacles = randXYList.slice(0, randXYList.length - weaponsNumber).sort();
		
		//-----INFO-----\\
		//The slice() method selects the elements starting at the given start argument, 
		//and ends at, but does not include, the given end argument.
		//Returns the selected elements in an array, as a new array object.
		var arr = []; 
		randXYList.slice(randXYList.length - weaponsNumber).sort().forEach(function (itemXY, index) {
			var newWeapon = new Weapon(defaultDamage * (index + 2), 'weapon' + (index + 2));
			arr.push({x: itemXY[0], y: itemXY[1], weapon: newWeapon});
			});
		this.weapons = arr; 
		//console.log("coordonnées des joueurs/armes= ", randXYList[0], randXYList[1], arr); 

		// MAJ des tableaux de mouvements possibles
		this.playerOne.updatePossibleMoves(this.board.fields, this.obstacles.concat([[this.playerTwo.x, this.playerTwo.y]]));		
		this.playerTwo.updatePossibleMoves(this.board.fields, this.obstacles.concat([[this.playerOne.x, this.playerOne.y]]));
		
		// Définition des 'états' du jeu
		this.states = {
			START: 0,
			PLAYERONE_TURN: 1,
			PLAYERTWO_TURN: 2,
			PLAYERONE_BATTLEMODE: 3,
			PLAYERTWO_BATTLEMODE: 4,
			GAMEOVER: 5
			};

		this.battleModeStates = {
			ON: true,
			OFF: false
			};
		
		this.gameOverStates = {
			PLAYERONE_WINS: 'playerOne',
			PLAYERTWO_WINS: 'playerTwo',
			DRAW: 'draw'
			}
		
		this.state = this.states.START;
		
		this.battleModeState = this.battleModeStates.OFF;

		}

	this.randomFieldList = function (quantity) {
			var maxQuantity = boardSize * boardSize / 4;
			//console.log(quantity);
			if (quantity < maxQuantity && quantity >= 1) {
				var randomXYArr = [[getRandomNumber(boardSize), getRandomNumber(boardSize)]];
				if (quantity > 1) {
				var i = 1;
				while (i < quantity) {
					var newRandomIndex = [getRandomNumber(boardSize), getRandomNumber(boardSize )];
					// Si les nouvelles coordonnées newRandomIndex sont uniques, ajout à randomXYArr
					if (!isInArray(newRandomIndex, randomXYArr)) {
						randomXYArr.push(newRandomIndex);
						i++;
						}
					}
				}
				return randomXYArr;
			}
			else {
				console.log(Error('Quantité d indexes: ' + quantity + ' plus grande que maximum: ' + maxQuantity));
				return [];
			}
		};
	
	// MAJ arme sur le plateau quand joueur passe dessus
	this.updatePlayerWeaponOnPath = function (player, path) {
		for (var i = 0; i < path.length; i++) {
			for (var j = 0; j < this.weapons.length; j++) {
				// Si une arme est disponible à cet endroit du plateau
				if ((path[i][0] === this.weapons[j].x) && (path[i][1] === this.weapons[j].y)) {
					// Si le joueur n'a pas d'arme ( par défaut )
					if (player.weapon.model === this.defaultWeapon.model) {
							player.updateWeapon(this.weapons[j].weapon);
							// Retirer l'arme du plateau
							this.weapons[j].x = -1;
							this.weapons[j].y = -1;
						}
					else {
						// Echanger l'arme du joueur
						if (i > 0) {
							var tempWeapon = player.weapon;
							player.updateWeapon(this.weapons[j].weapon);
							this.weapons[j].weapon = tempWeapon;
							}
						}
					}
				}
			}
		};
	
	// MAJ position joueur, contenu des cases du plateau et compte-tours
	this.actionMove = function (player, newCoordinates, path) {
			var oldCoordinates = [player.x, player.y];
			player.updatePosition(this.board.fields, newCoordinates, oldCoordinates);
			this.updatePlayerWeaponOnPath(player, path);
		
			// MAJ déplacements possibles, exclure les obstacles et la position de l'adversaire
			player.updatePossibleMoves(this.board.fields, this.obstacles.concat([[this.getOpponnent(player).x, this.getOpponnent(player).y]]));
		
			// idem joueur opposé
			this.getOpponnent(player).updatePossibleMoves(this.board.fields, this.obstacles.concat([[player.x, player.y]]));
		
			// incrémenter le compte-tours
			this.turnCounter++;
		};

	// Change l'état du jeu
	this.updateState = function (newState) {
			this.state = newState;
		};
		
	// active/désactive le mode combat
	this.updateBattleModeState = function (boolean) {
			this.battleModeState = boolean;
		};

	this.getOpponnent = function (player) {
		return (player === this.playerOne) ? this.playerTwo : this.playerOne;
		};

	}


