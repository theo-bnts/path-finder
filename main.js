const { Chemin, Feuille, Graphe, Grille, Outils, Sommet } = require('./entites');

const start_timestamp = new Date().getTime();

const feuille = new Feuille('./assets/Map.xlsx', 'Sheet1');
feuille.lire().then(() => {

const grille = new Grille(feuille.vers_tableau('B2:V21'));
const graphe = new Graphe(grille);

const sommets_a_visiter = feuille.vers_tableau('W4:Y10')
    .map(cellule => new Sommet(grille, cellule[0] - 1, cellule[1] - 1));

const sommets_bonus = feuille.vers_tableau('Z4:AC10')
    .map(cellule => {
        const sommet = new Sommet(grille, cellule[0] - 1, cellule[1] - 1);
        sommet.bonus = cellule[2];
        return sommet;
    })

const chemins_possibles = Outils.permutations(sommets_a_visiter)
    .map(sommets => {
        sommets.unshift(new Sommet(grille, 11 - 1, 19 - 1));

        let chemin_complet = [];

        for (let i = 0; i < sommets.length - 1; i++) {
            const { chemin } = graphe.distance_minimale(sommets[i], sommets[i + 1]);

            chemin_complet.push(...chemin);
        }

        return new Chemin(chemin_complet);
    })
    .sort((chemin_a, chemin_b) => chemin_a.points(sommets_bonus) - chemin_b.points(sommets_bonus));

const chemin = chemins_possibles[0];

chemin.afficher(sommets_bonus);

for (const sommet of chemin.sommets) {
    feuille.surbrillance_cellule('B2:V21', sommet.x, sommet.y);
}

feuille.ecrire('./assets/Output.xlsx');

console.log('Temps d\'exécution : ' + (new Date().getTime() - start_timestamp) / 1000 + ' secondes');
});