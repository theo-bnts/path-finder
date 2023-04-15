class Sommet {
    constructor(...args) {
        const [grille] = args;

        if (args.length === 2) {
            const [_, indice] = args;

            this.indice = indice;
        } else if (args.length === 3) {
            const [_, x, y] = args;

            this.indice = y * grille.nb_colonnes + x;
        }

        this.x = this.indice % grille.nb_colonnes;
        this.y = Math.floor(this.indice / grille.nb_colonnes);

        this.valeur = grille.tableau[this.y][this.x];

        this.bonus = 0;
    }

    toString() {
        return '(' + (this.x + 1) + ', ' + (this.y + 1) + ')';
    }
}

module.exports = Sommet;