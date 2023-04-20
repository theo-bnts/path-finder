class Sommet {
    constructor(x, y, valeur, bonus = 0) {
        this.x = x;
        this.y = y;
        this.valeur = valeur;
        this.bonus = bonus;
    }

    indice(nb_colonnes) {
        return Sommet.indice(this.x, this.y, nb_colonnes);
    }

    toString() {
        return '(' + (this.x + 1) + ', ' + (this.y + 1) + ')';
    }

    static indice(x, y, nb_colonnes) {
        return y * nb_colonnes + x;
    }

    static coordonnees(indice, nb_colonnes) {
        return {
            x: indice % nb_colonnes,
            y: Math.floor(indice / nb_colonnes)
        };
    }
}

export default Sommet;