class Outils {
    static nombre_permutations(nombre_sommets) {
        if (nombre_sommets <= 1) {
            return 1;
        } else {
            return nombre_sommets * Outils.nombre_permutations(nombre_sommets - 1);
        }
    }

    static permutations(sommets) {
        let resultat = [];

        function permute(tableau, permutationCourante = []) {
            if (tableau.length === 0) {
                resultat.push(permutationCourante);
            } else {
                for (let i = 0; i < tableau.length; i++) {
                    const copieTableau = tableau.slice();
                    const sommetSuivant = copieTableau.splice(i, 1);
                    permute(copieTableau.slice(), permutationCourante.concat(sommetSuivant));
                }
            }
        }

        permute(sommets);

        return resultat;
    }
}

module.exports = Outils;