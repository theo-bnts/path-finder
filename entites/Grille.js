import { Bonus, Sommet } from './index.js';

class Grille {
    constructor(tableau, coordonnees_bonus, valeurs_bonus) {
        this.sommets = tableau
            .map((ligne, y) =>
                ligne
                    .map((valeur, x) =>
                        new Sommet(
                            x,
                            y,
                            valeur >= 0 ? valeur : Number.MAX_SAFE_INTEGER,
                            Bonus.valeur(coordonnees_bonus, valeurs_bonus, x, y)
                        )
                    )
            )
            .flat();

        this.nb_lignes = tableau.length;
        this.nb_colonnes = tableau[0].length;
        this.nb_sommets = this.nb_lignes * this.nb_colonnes;
    }

    sommet(x, y) {
        return this.sommets[Sommet.indice(x, y, this.nb_colonnes)];
    }
}

export default Grille;