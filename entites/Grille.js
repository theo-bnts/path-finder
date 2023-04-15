class Grille {
    constructor(tableau) {
        this.tableau = tableau;
        this.nb_lignes = tableau.length;
        this.nb_colonnes = tableau[0].length;
        this.nb_sommets = this.nb_lignes * this.nb_colonnes;
    }
}

module.exports = Grille;