const { Chemin, Feuille, Graphe, Grille, Outils, Sommet } = require('./entites');

const chemin_fichier_source = './assets/Map.xlsx';
const chemin_fichier_sortie = './assets/Output.xlsx';
const feuille_source = 'Sheet1';
const plage_sommets = 'B2:V21';
const plage_sommets_strategiques = 'W4:Y10';
const plage_sommets_bonus = 'Z4:AC9';

const start_timestamp = new Date().getTime();

// Lecture feuille
const feuille = new Feuille(chemin_fichier_source, feuille_source);
feuille.lire().then(() =>
{
    const grille = new Grille(feuille.vers_tableau(plage_sommets));
    const graphe = new Graphe(grille);

    // Lecture sommets à visiter et bonus

    const sommets_strategiques = feuille.vers_tableau(plage_sommets_strategiques).map(cellule => new Sommet(grille, cellule[0] - 1, cellule[1] - 1));

    const sommets_a_visiter = [sommets_strategiques[1 - 1], sommets_strategiques[3 - 1], sommets_strategiques[6 - 1], sommets_strategiques[7 - 1]]

    const sommets_bonus = feuille.vers_tableau(plage_sommets_bonus)
        .map(cellule => {
            const sommet = new Sommet(grille, cellule[0] - 1, cellule[1] - 1);
            sommet.bonus = cellule[2];
            return sommet;
        })

    // Calcul de tous les chemins possibles
    console.log('Calcul des permutations possibles');

    const nombre_permutations = Outils.nombre_permutations(sommets_a_visiter.length + sommets_bonus.length);
    let permutations_traites = 0;

    const chemins_possibles = Outils.permutations([...sommets_a_visiter, ...sommets_bonus])
        .map(sommets => {
            if (permutations_traites % 1000000 === 0 || permutations_traites === 0 || permutations_traites === nombre_permutations) {
                console.log(
                    'Permutation ' + permutations_traites + ' / ' + nombre_permutations + ' - '
                        + 'Temps restant : ' + ((new Date().getTime() - start_timestamp) / 1000 * (nombre_permutations - permutations_traites) / permutations_traites).toFixed(3) + ' secondes'
                );
            }
            permutations_traites++

            sommets.unshift(new Sommet(grille, 11 - 1, 19 - 1));

            let chemin_complet = [];
            let distance_totale = 0;

            for (let i = 0; i < sommets.length - 1; i++) {
                const { chemin, distance } = graphe.distance_minimale(sommets[i], sommets[i + 1]);

                chemin_complet.push(...chemin);
                distance_totale += distance;
            }

            return new Chemin(chemin_complet, distance_totale);
        })

    // Calcul du meilleur chemin
    console.log('Calcul du meilleur chemin');

    chemins_possibles.sort((chemin_a, chemin_b) => chemin_a.points(sommets_bonus) - chemin_b.points(sommets_bonus));

    // Affichage du meilleur chemin
    console.log('Affichage du meilleur chemin');

    const chemin = chemins_possibles[0];

    for (const sommet of chemin.sommets) {
        feuille.surbrillance_cellule(plage_sommets, sommet.x, sommet.y);
    }

    // Ecriture fichier
    console.log('Ecriture fichier');

    feuille.ecrire(chemin_fichier_sortie);

    console.log('Temps d\'exécution : ' + (new Date().getTime() - start_timestamp) / 1000 + ' secondes');
});