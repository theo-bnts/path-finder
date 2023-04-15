const _ = require('lodash');

const Sommet = require('./Sommet');

class Graphe {
    constructor(grille) {
        this.grille = grille;

        this.matrice_adjacence = _.times(this.grille.nb_sommets, () => _.times(this.grille.nb_sommets, _.constant(0)));

        this.tableau_distances_minimales = new Array(grille.nb_sommets).fill(null);

        _.times(this.grille.nb_lignes, y => {
            _.times(this.grille.nb_colonnes, x => {
                const sommet_courant = new Sommet(this.grille, x, y);

                for (let decalage_y = -1; decalage_y <= 1; decalage_y++) {
                    for (let decalage_x = -1; decalage_x <= 1; decalage_x++) {
                        if (
                            decalage_y !== 0 ^ decalage_x !== 0
                            && y + decalage_y >= 0
                            && x + decalage_x >= 0
                            && y + decalage_y < this.grille.nb_lignes
                            && x + decalage_x < this.grille.nb_colonnes
                        ) {
                            const sommet_voisin = new Sommet(this.grille, x + decalage_x, y + decalage_y);

                            this.matrice_adjacence[sommet_courant.indice][sommet_voisin.indice]
                                = sommet_voisin.valeur >= 0
                                    ? sommet_voisin.valeur
                                    : Number.MAX_SAFE_INTEGER
                                ;
                        }
                    }
                }
            });
        });
    }

    distance_minimale(sommet_source, sommet_destination) {
        const { chemins, distances } = this.distances_minimales(sommet_source);

        return {
            chemin: chemins[sommet_destination.indice],
            distance: distances[sommet_destination.indice]
        };
    }

    distances_minimales(sommet_source) {
        if (this.tableau_distances_minimales[sommet_source.indice] === null) {
            this.tableau_distances_minimales[sommet_source.indice] = this.dijkstra(sommet_source);
        }

        return this.tableau_distances_minimales[sommet_source.indice];
    }


    dijkstra(sommet_source) {
        const distances = new Array(this.grille.nb_sommets).fill(Number.MAX_SAFE_INTEGER);
        distances[sommet_source.indice] = 0;

        const chemins = new Array(this.grille.nb_sommets).fill([]);

        const sommets_traites = new Array(this.grille.nb_sommets).fill(false);

        _.times(this.grille.nb_sommets, () => {
            const sommet_courant = this.sommet_distance_minimale(distances, sommets_traites);

            if (sommet_courant !== null) {
                sommets_traites[sommet_courant.indice] = true;

                _.times(this.grille.nb_sommets, indice_sommet => {
                    if (
                        this.matrice_adjacence[sommet_courant.indice][indice_sommet] > 0
                        && !sommets_traites[indice_sommet]
                        && distances[indice_sommet] > distances[sommet_courant.indice] + this.matrice_adjacence[sommet_courant.indice][indice_sommet]
                    ) {
                        distances[indice_sommet] = distances[sommet_courant.indice] + this.matrice_adjacence[sommet_courant.indice][indice_sommet];
                        chemins[indice_sommet] = [...chemins[sommet_courant.indice], new Sommet(this.grille, indice_sommet)];
                    }
                });
            } else {
                //throw new Error('Sommet inaccessible');
            }
        });

        return { chemins, distances };
    }

    sommet_distance_minimale(distances, sommets_traites) {
        let sommet_distance_minimale = null;
        let distance_minimale = Number.MAX_SAFE_INTEGER;

        _.times(this.grille.nb_sommets, indice_sommet => {
            if (!sommets_traites[indice_sommet] && distances[indice_sommet] < distance_minimale) {
                sommet_distance_minimale = new Sommet(this.grille, indice_sommet);
                distance_minimale = distances[indice_sommet];
            }
        });

        return sommet_distance_minimale;
    }
}

module.exports = Graphe;