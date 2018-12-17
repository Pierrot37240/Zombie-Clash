
// ---------- Affichage -------------------------------------------

var Display = function () {
	var displayContext = this;
	this.init = function (gameObject) {
		this.classNames = {
			playerOne: gameObject.playerOne.customClass,
			playerTwo: gameObject.playerTwo.customClass,
			nextStep: 'step',
			obstacle: 'obstacle',
			weapon: 'weapon',
			range: 'range',
			path: 'path'
		};
		// Générer le plateau de jeu
		this.board = this.generateBoard(gameObject.board.fields, gameObject.obstacles);
		
		// Afficher le plateau
		this.showBoard(this.board);

		// Afficher les joueurs
		this.showPlayer(gameObject.playerOne, gameObject);
		this.showPlayer(gameObject.playerTwo, gameObject);
		this.showPlayerRange(gameObject.playerOne);

		// Afficher les armes
		this.showWeapons(gameObject.weapons);
	}

	this.generateBoard = function (fieldsArr, obstacles) {
		var boardHTML = $('<div>');
		// Construction des ID :
		//			COL0 COL1 COL2 COL3 COL4 COL5 COL6 COL7 COL8 COL9
		//lIGNE 0 :  00   01   02   03   04   05   06   07   08   09
		//lIGNE 1 :  10   11   12   13   14   15   16   17   18   19  
		//lIGNE 2 :  20   21   22   23   24   25   26   27   28   29  
		//lIGNE 3 :  30   31   32   33   34   35   36   37   38   39  
		//lIGNE 4 :  40   41   42   43   44   45   46   47   48   49  
		//lIGNE 5 :  50   51   52   53   54   55   56   57   58   59  
		//lIGNE 6 :  60   61   62   63   64   65   66   67   68   69  
		//lIGNE 7 :  70   71   72   73   74   75   76   77   78   79  
		//lIGNE 8 :  80   81   82   83   84   85   86   87   88   89
		//lIGNE 9 :  90   91   92   93   94   95   96   97   98   99 

		// Pour chaque ligne du tableau
		for (var x = 0; x < fieldsArr.length; x++) {
			// Créer une div avec une classe "ligne"
			var row = $('<div>').addClass('row');
			// Pour chaque champ par ligne
			for (var y = 0; y < fieldsArr.length; y++) {
				// Créer une div avec une classe, un ID comprenant l'index du champ dans son nom, et son contenu
				var field = $('<div>').addClass((isInArray([x, y], obstacles) ? 'field ' + this.classNames.obstacle : 'field'));
				field.attr('id', 'field-' + x + y);
				field.append($('<div>').addClass('background').append($('<div>').addClass('object')));
				// Ajouter le champ à la ligne
				row.append(field);
			}
		// Ajouter la ligne au plateau de jeu
		boardHTML.append(row);
		}
	return boardHTML;
	}

	this.showBoard = function (elementHTML) {
		var boardHTML = $('#board');
		boardHTML.html('');
		boardHTML.append(elementHTML);
	}

	this.showPlayer = function (player, gameObject) {
		// ajout classe css
		addClassName([player.x, player.y], player.customClass);
		// Mettre les joueurs face à face
		/*var opponent = gameObject.getOpponnent(player);
		var player = $(player).children().get(1);//('div:eq(0)');
		var opponent = $(opponent).children('div:eq(0)');
		if (opponent.x > player.x) {
			removeClassName([player.x, player.y], "left");
			addClassName([player.x, player.y], "right");
			removeClassName([opponent.x, opponent.y], "right");
			addClassName([opponent.x, opponent.y], "left");
		}
		else if (player.x > opponent.x) {
			removeClassName([player.x, player.y], "right");
			addClassName([player.x, player.y], "left");
			removeClassName([opponent.x, opponent.y], "left");
			addClassName([opponent.x, opponent.y], "right");
		}*/
	}

	this.hidePlayer = function (player, gameObject) {
		// cacher les déplacements possibles
		this.path.forEach(function (pathElement) {
			removeClassName([pathElement[0], pathElement[1]], this.classNames.path);
		}, this);
		// cacher le joueur
		removeClassName([player.x, player.y], player.customClass);
	}

	// Afficher les déplacements possibles du joueur
	this.showPlayerRange = function (player) {
		// Pour chaque coordonnée dans le tableau de mouvements possibles du joueur
		for (var i = 0; i < player.possibleMoves.length; i++) {
			// Ajouter la classe 'range' pour css
			var field = $('#field-'.concat(player.possibleMoves[i][0], player.possibleMoves[i][1]));
			if (!field.hasClass(this.classNames.range)) {
				field.addClass(this.classNames.range);
			}
		}
	}

	// Et inversement
	this.hidePlayerRange = function (player) {
		// Pour chaque coordonnée dans le tableau de mouvements possibles du joueur
		for (var i = 0; i < player.possibleMoves.length; i++) {
			// Trouver l'élément avec un id #field-xy
			var field = $('#field-'.concat(player.possibleMoves[i][0], player.possibleMoves[i][1]));
			// Retirer la classe 'range' sauf si l'un des 2 joueurs est dessus
			if (field.hasClass(this.classNames.range)) {
				field.removeClass(this.classNames.range);
			}
		}
	}

	// Afficher les armes
	this.showWeapons = function (weapons) {
		for (var i = 0; i < weapons.length; i++) {
			addClassName([weapons[i].x, weapons[i].y], weapons[i].weapon.model);
		}
	}


	// Cacher les armes
	this.hideWeapons = function (weapons) {
		for (var i = 0; i < weapons.length; i++) {
			removeClassName([weapons[i].x, weapons[i].y], weapons[i].weapon.model);
		}
	}

	// Générer la trajectoire
	this.makePath = function (player, clickTarget) {
		// Effacer la trajectoire précédante
		this.path = [];
		//TODO : inclure ou non la position du joueur, à voir avec l'animation...
		// Mouvement horizontal
		if (player.x == clickTarget[0]) {
			// vers la droite
			if (player.y < clickTarget[1]) {
				for (var i = player.y; i < (clickTarget[1] + 1); i++) {
					this.path.push([player.x, i]);
				}
			// vers la gauche
			} else {
				for (var i = player.y; i > (clickTarget[1] - 1); i--) {
					this.path.push([player.x, i]);
				}
			}
		// Mouvement vertical
		} else {
			// vers le bas
			if (player.x < clickTarget[0]) {
				for (var i = player.x; i < (clickTarget[0] + 1); i++) {
					this.path.push([i, player.y]);
				}
			// vers le haut
			} else {
				for (var i = player.x; i > (clickTarget[0] - 1); i--) {
					this.path.push([i, player.y]);
				}
			}
		}
		console.log(this.path);
	}


// ------------------- animation déplacements ------------------------

	// Créer un tableau contenant les directions et longueurs des déplacements
	this.getPathAnimationStyles = function (path, elWidth, elHeight) {
		var animationStyles = [];

		for (var i = 1; i < path.length; i++) {
			// déplacement vertical
			if (path[i - 1][0] !== path[i][0]) {
				// vers le haut
				if (path[i - 1][0] > path[i][0]) {
					animationStyles.push(['top', -elHeight]);
				} 
				// vers le bas
				else {
					animationStyles.push(['bottom', -elHeight]);
				}
			} 
			// mouvement horizontal
			else if (path[i - 1][1] !== path[i][1]) {
				// vers la gauche
				if (path[i - 1][1] > path[i][1]) {
					animationStyles.push(['left', -elWidth]);
				} 
				// vers la droite
				else {
					animationStyles.push(['right', -elWidth]);
				}
			}
		}
		return animationStyles;
	};


	// Animer les déplacements avec les données générées avec 'getPathAnimationStyles' ci-dessus
	// Fonction récursive, la sortie dépend de la valeur d'"index"
	this.animateSteps = function (gameObject, player, animatedElement, animationStyles, index) {
		// si index atteint le nombre de pas, fin de l'animation
		if (index >= animationStyles.length) {
			animatedElement.remove();
			displayContext.showPlayer(player, gameObject);
			if (gameObject.state === gameObject.states.PLAYERONE_TURN) {
				displayContext.showPlayerRange(gameObject.playerOne);
			}
			else if (gameObject.state === gameObject.states.PLAYERTWO_TURN) {
				displayContext.showPlayerRange(gameObject.playerTwo);
			}
		}
		// sinon début/suite de l'animation
		else if ((index >= 0) && (index < animationStyles.length)) {
			var animationStyle = {};
			// mettre la direction dans la variable 'propertyName'
			var propertyName = animationStyles[index][0];
			// mettre en variable le nombre de pixels de chaque déplacement (60px)
			var currentDistance = (parseInt(animatedElement.css(propertyName)) + animationStyles[index][1]) + 'px';
			animationStyle[propertyName] = currentDistance;
			//animationStyle['z-index'] = 1000;

			// Mettre la classe css 'move-' (sprite) sur child de animatedElement, complétée par la direction
			animatedElement.children().eq(0).addClass('move-' + propertyName);
			// Appliquer 'Animate'
			animatedElement.animate(animationStyle, 500, 'linear',
			// Callback après animation :
			function () {
				animatedElement.css(propertyName, currentDistance).children().eq(0).removeClass('move-' + propertyName);
				// Récursive
				displayContext.animateSteps(gameObject, player, animatedElement, animationStyles, index + 1);
				// incrémenter l'index
				index++;
			});
		}
	};


	this.showPlayerMoving = function (gameObject, player, path) {
		// Si le joueur change de position
		if (path.length > 1) {
			// Définir le point de départ
			var startElement = $('#field-'.concat(player.xOrigin, player.yOrigin));
			var elHeight = startElement.outerHeight();
			var elWidth = startElement.outerWidth();

			// création de l'élément à animer
			var animatedElement = $('<div>').addClass(player.customClass).addClass('background').append($('<div>').addClass('moving'));
			// insertion de l'élément à animer dans le point de départ
			startElement.append(animatedElement);

			// définition tableau contenant la trajectoire
			var animationStyles = this.getPathAnimationStyles(path, elWidth, elHeight);
			// définition index
			var animationIndex = 0;

			// Animer le tout
			this.animateSteps(gameObject, player, animatedElement, animationStyles, animationIndex);
		} else {
			this.showPlayer(player, gameObject);
			this.showPlayerRange(gameObject.getOpponnent(player));
		}
	};


// --------------------- GESTION MOUVEMENT ----------------------

	this.playerMoves = function (gameObject, player, displayObject) {
		this.hidePlayerRange(player);
		this.hidePlayer(player, gameObject);
		this.hideWeapons(gameObject.weapons);

		// Mettre à jour les tableaux : position et origine du joueur, des armes et des déplacements possibles pour les 2 joueurs
		var i = displayObject.path.length - 1;
		var newX = displayObject.path[i][0];
		var newY = displayObject.path[i][1];
		gameObject.actionMove(player, [newX, newY], displayObject.path);

		this.showPlayerMoving(gameObject, player, displayObject.path);

		// TODO : mettre en origine du prochain déplacement l'emplacement d'origine du prochain joueur
		//this.updateOrigin(gameObject.getOpponnent(player));

		this.showWeapons(gameObject.weapons);
		}
	};

// ----------------------- Fonctions d'aide --------------------

var addClassName = function (coordinates, customClass) {
	if (coordinates[0] >= 0 && coordinates[1] >= 0) {
		var element = $('#field-'.concat(coordinates[0], coordinates[1]));
		if (!element.hasClass(customClass)) {
			element.addClass(customClass);
			}
		}
	};


var removeClassName = function (coordinates, customClass) {
	var element = $('#field-'.concat(coordinates[0], coordinates[1]));
	if (element.hasClass(customClass)) {
		element.removeClass(customClass);
		}
	};
