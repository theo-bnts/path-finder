class Chemin {
    constructor(sommets) {
        this.sommets = sommets;
    }

    toString() {
        return '[' + this.sommets.join(', ') + '] (' + this.distance() + ')';
    }

    afficher(sommets_bonus) {
        console.log('Chemin [(x, y), ...] : ' + this);
        console.log('Distance : ' + this.distance());
        console.log('Bonus : ' + this.bonus(sommets_bonus));
        console.log('Points : ' + this.points(sommets_bonus));
    }

    distance() {
        return this.sommets.reduce((total, sommet) => total + sommet.valeur, 0);
    }

    contient_sommet(sommet) {
        return this.sommets.some(sommet_courant => sommet_courant.indice === sommet.indice);
    }

    bonus(sommets_bonus) {
        return sommets_bonus.reduce((total, sommet_bonus) =>
            this.contient_sommet(sommet_bonus) ? total + sommet_bonus.bonus : total,
            0
        );
    }

    points(sommets_bonus) {
        return this.distance() - this.bonus(sommets_bonus);
    }
}

module.exports = Chemin;