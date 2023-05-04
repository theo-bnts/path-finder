import { Chemin, Feuille, Graphe, Grille, Outils } from './entites/index.js';

const start_timestamp = new Date().getTime();

const chemin_fichier_source = './assets/Map.xlsx';
const chemin_fichier_sortie = './assets/Output_' + new Date(start_timestamp).toISOString().replace(/:/g, '-') + '.xlsx';
const feuille_source = 'Sheet1';
const plage_sommets = 'B2:V21';
const plage_coordonnees_strategiques = 'W4:X10';
const plage_coordonnees_bonus = 'Z4:AB10';
const coordonnees_depart = [11 - 1, 19 - 1];
const points_strategiques_obligatoires = [1 - 1, 3 - 1, 6 - 1, 7 - 1];
const points_par_point_strategique = 30;

// Lecture feuille
const feuille = new Feuille(chemin_fichier_source, feuille_source);
await feuille.lire();

// Lecture coordonnees stratégiques
const coordonnees_strategiques = feuille.vers_tableau(plage_coordonnees_strategiques).map(cellule => [cellule[0] - 1, cellule[1] - 1]);
const coordonnees_strategiques_obligatoires = coordonnees_strategiques.filter(coordonnees => points_strategiques_obligatoires.includes(coordonnees_strategiques.indexOf(coordonnees)));

// Lecture coordonnes bonus
const coordonnees_et_valeurs_bonus = feuille.vers_tableau(plage_coordonnees_bonus);
const coordonnees_bonus = coordonnees_et_valeurs_bonus.map(cellule => [cellule[0] - 1, cellule[1] - 1]);
const valeurs_bonus = coordonnees_et_valeurs_bonus.map(cellule => cellule[2]);

const coordonnees_speciales = [...coordonnees_strategiques_obligatoires, ...coordonnees_bonus]
const valeurs_speciales = [...coordonnees_strategiques_obligatoires.map(() => points_par_point_strategique), ...valeurs_bonus]

// Liste des permutations de coordonnes stratégiques (obligatoires) et bonus (facultatives)
const liste_coodonnes_visitees = Outils.permutations(coordonnees_speciales, coordonnees_strategiques_obligatoires)

// Lecture valeurs points
const valeurs_points = feuille.vers_tableau(plage_sommets);
const grille = new Grille(valeurs_points, coordonnees_speciales, valeurs_speciales);
const graphe = new Graphe(grille);

// Calcul du chemin optimal
let chemin_optimal = null;
let points_maximaux = Number.MIN_SAFE_INTEGER;

for (const coordonnees_visitees of liste_coodonnes_visitees) {
    coordonnees_visitees.unshift(coordonnees_depart);

    const coordonnees_visitees_completes = [];
    let distance_totale = 0;

    for (let i = 0; i < coordonnees_visitees.length - 1; i++) {
        const coordonnees_depart = coordonnees_visitees[i];
        const coordonnees_arrivee = coordonnees_visitees[i + 1];
        
        const sommet_depart = grille.sommet(coordonnees_depart[0], coordonnees_depart[1]);
        const sommet_arrivee = grille.sommet(coordonnees_arrivee[0], coordonnees_arrivee[1]);

        const { chemin, distance } = graphe.distance_minimale(sommet_depart, sommet_arrivee);

        coordonnees_visitees_completes.push(...chemin);
        distance_totale += distance;
    }

    const chemin = new Chemin(coordonnees_visitees_completes, distance_totale);
    const points = chemin.points();

    if (points > points_maximaux) {
        chemin_optimal = chemin;
        points_maximaux = points;
    }
}

// Affichage du meilleur chemin
chemin_optimal.afficher();

// Surbrillance du meilleur chemin
for (const sommet of chemin_optimal.sommets) {
    feuille.surbrillance_cellule(plage_sommets, sommet.x, sommet.y);
}

// Ecriture feuille
feuille.ecrire(chemin_fichier_sortie);

console.log('Temps d\'exécution : ' + (new Date().getTime() - start_timestamp) / 1000 + ' secondes');