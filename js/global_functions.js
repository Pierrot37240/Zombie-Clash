	// ---------- Functions Globales ----------------------------------------
	
function getRandomNumber (number) {
		return (number > 1) ? Math.floor(Math.random() * Number(number)) : 0;
	}
	
	
function distance (x1, y1, x2, y2) {
		return Math.abs(x1 - x2) + Math.abs(y1 - y2);
	}
	
	
function isInArray (coordinates, array) {
		if (getCoordinatesIndex(coordinates, array) < 0) {
			return false;
		} else {
			return true;
		}
	}
	
	
function getCoordinatesIndex (coordinates, array) {
		var ind = -1;
		array.some(
			//-----INFO-----\\
			//The some() method executes the function once for each element present in the array: 
			//If it finds an array element where the function returns a true value, some() returns true (and does not check the remaining values) 
			//Otherwise it returns false.
			function (element, index) {
				if ((element[0] === coordinates[0]) && (element[1] === coordinates[1])) {
					ind = index;
					return true;
					}
				return false;
			});
		return ind;
	}

