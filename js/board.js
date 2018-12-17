//	---------- object plateau de jeu----------------------------------------
	
	
/*	Le plateau est un carré de taille définie
  	composé de champs rangés en tableaux de tableaux
  	Chaque élément du plateau est composé de:
	- x abscisse,
	- y ordonnée,
	- contenu
        fields[x][y][fieldClasses index]  */
	
	
var Board = function () {
	// Le plateau dispose de 4 types de remplissage
	this.fieldClasses = {
		empty: 'available',
		obstacle: 'unavailable',
		player: 'player',
		weapon: 'weapon'
		};

	this.init = function (size) {
		this.size = size;	//size = 10
		this.fields = [];
		for (var x = 0; x < this.size; x++) {
			var column = [];
			for (var y = 0; y < this.size; y++) {
				column.push(this.fieldClasses.empty);
			}
			this.fields.push(column);
		}
		
	};
};