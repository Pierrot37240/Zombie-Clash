	// ---------- Objet Arme -------------------------------------------

var Weapon = function (damageMultiplier, model) {
	this.damage = damageMultiplier || 1;
	this.model = model || 'default';
	};