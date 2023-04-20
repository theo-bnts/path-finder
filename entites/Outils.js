import _ from 'lodash';

class Outils {
    static nombre_permutations(nombre_sommets) {
        if (nombre_sommets <= 1) {
            return 1;
        } else {
            return nombre_sommets * Outils.nombre_permutations(nombre_sommets - 1);
        }
    }

    static permutations(valeurs, valeurs_obligatoires, permutation_courante = []) {
        let resultats = [];

        if (valeurs_obligatoires.every(valeur => permutation_courante.some(v => v[0] === valeur[0] && v[1] === valeur[1]))) {
            resultats.push(permutation_courante);
        }

        for (let i = 0; i < valeurs.length; i++) {
            const copie_valeurs = _.clone(valeurs);
            const suivant = copie_valeurs.splice(i, 1);
            if (suivant.length > 0) {
                resultats = resultats.concat(Outils.permutations(copie_valeurs.slice(), valeurs_obligatoires, permutation_courante.concat(suivant)));
            }
        }

        return resultats;
    }

    static array(nb_elements, valeur) {
        return _.times(nb_elements, () => valeur);
    }

    static two_dimensions_array(nb_lignes, nb_colonnes, valeur) {
        return _.times(nb_lignes, () =>
            _.times(nb_colonnes, () => valeur)
        );
    }
}

export default Outils;