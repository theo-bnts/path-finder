import _ from 'lodash';

class Outils {
    static * permutations(valeurs, valeurs_obligatoires, permutation_courante = []) {
        if (valeurs_obligatoires.every(valeur => permutation_courante.some(v => v[0] === valeur[0] && v[1] === valeur[1]))) {
            yield permutation_courante;
        }

        for (let i = 0; i < valeurs.length; i++) {
            const copie_valeurs = valeurs.slice();
            const suivant = copie_valeurs.splice(i, 1);
            if (suivant.length > 0) {
                yield* Outils.permutations(copie_valeurs.slice(), valeurs_obligatoires, permutation_courante.concat(suivant));
            }
        }
    }

    static tableau(nb_elements, valeur) {
        return _.times(nb_elements, () => valeur);
    }

    static tableau_2D(nb_lignes, nb_colonnes, valeur) {
        return _.times(nb_lignes, () =>
            _.times(nb_colonnes, () => valeur)
        );
    }
}

export default Outils;