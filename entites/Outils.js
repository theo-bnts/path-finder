class Outils {
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