//	---------- object Joueur-------------------------------------------------

var Player = function () {
	this.init = function (coordinates, rangeLimit, power, weapon, customClass) {
			this.x = coordinates[0];
			this.y = coordinates[1];
			this.rangeLimit = rangeLimit || 3;
			this.possibleMoves = [];
			this.xOrigin = coordinates[0];
			this.yOrigin = coordinates[1];
			this.power = power || 100;
			this.weapon = weapon;
			this.customClass = customClass;
		};
	
	this.updatePossibleMoves = function (fieldsArr, obstacles) {
		// plage max de déplacement sur le plateau (fieldArr)
		var topLeft = {
			x: Math.min(Math.abs(this.x - this.rangeLimit), 0),
			y: Math.min(Math.abs(this.y - this.rangeLimit), 0)
		};
		var bottomRight = {
			x: Math.min(this.x + this.rangeLimit, fieldsArr.length - 1),
			y: Math.min(this.y + this.rangeLimit, fieldsArr[0].length - 1)
		};
	
		// Générer un tableau de mouvements autorisés autour du joueur,
		// coordonnées verticales et horizontales excluant les obstacles et le joueur
		var arr = [];
		// vers le haut jusqu'au 1er obstacle
		for (var y = this.y - 1; y >= topLeft.y; y--) {
			// Si distance inférieure à limite de déplacement (3)
			if (distance(this.x, this.y, this.x, y) <= this.rangeLimit) {
				// Si le champ n'est pas un obstacle, ajout des coordonnées
				if (!isInArray([this.x, y], obstacles)) {
					arr.push([this.x, y]);
					}
				else break;
				}
			}
		// vers la droite jusqu'au 1er obstacle
		for (var x = this.x + 1; x <= bottomRight.x; x++) {
			if (distance(this.x, this.y, x, this.y) <= this.rangeLimit) {
				if (!isInArray([x, this.y], obstacles)) {
					arr.push([x, this.y]);
					}
				else break;
				}
			}
		// vers le bas jusqu'au 1er obstacle
		for (y = this.y + 1; y <= bottomRight.y; y++) {
			if (distance(this.x, this.y, this.x, y) <= this.rangeLimit) {
				if (!isInArray([this.x, y], obstacles)) {
					arr.push([this.x, y]);
				}
				else break;
				}
			}
		// vers la gauche jusqu'au 1er obstacle
		for (x = this.x - 1; x >= topLeft.x; x--) {
			if (distance(this.x, this.y, x, this.y) <= this.rangeLimit) {
				if (!isInArray([x, this.y], obstacles)) {
					arr.push([x, this.y]);
				}
				else break;
				}
			}
		this.possibleMoves = arr;
		//console.log(this, arr);
	};
	
	// maj position
	this.updatePosition = function (fieldArr, newCoordinates, oldCoordinates) {
			this.xOrigin = oldCoordinates[0];
			this.yOrigin = oldCoordinates[1];
			this.x = newCoordinates[0];
			this.y = newCoordinates[1];
		};
		
	// Vérif si on peut se positionner sur les coordonnées BOOLEAN
	this.positionIsPossible = function (coordinates) {
			return isInArray([coordinates[0], coordinates[1]], this.possibleMoves);
		};
	// MAJ points de santé
	this.updatePower = function (power) {
			if (power !== undefined) this.power = power;
		};
	
	// MAJ arme active pour le joueur
	this.updateWeapon = function (newWeapon) {
			this.weapon = newWeapon;
		};
	
	};