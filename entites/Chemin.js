class Chemin {
    constructor(sommets, distance) {
        this.sommets = sommets;
        this.distance = distance;
    }

    toString() {
        return '[' + this.sommets.join(', ') + ']';
    }

    afficher(sommets_bonus) {
        console.log('Chemin [(x, y), ...] : ' + this);
        console.log('Distance : ' + this.distance);
        console.log('Bonus : ' + this.bonus(sommets_bonus));
        console.log('Points : ' + this.points(sommets_bonus));
    }

    bonus() {
        return [...new Set(this.sommets)].reduce((total, sommet) => total + sommet.bonus, 0);
    }

    points(sommets_bonus) {
        return this.bonus(sommets_bonus) - this.distance;
    }
}

export default Chemin;