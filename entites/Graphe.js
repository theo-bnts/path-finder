import _ from 'lodash';

import { Outils, Sommet } from './index.js';

class Graphe {
    constructor(grille) {
        this.grille = grille;
        this.matrice_adjacence = this.creer_matrice_adjacence();
        this.distances_minimales = Outils.array(this.grille.nb_sommets, null);
    }

    creer_matrice_adjacence() {
        const matrice_adjacence = Outils.two_dimensions_array(this.grille.nb_sommets, this.grille.nb_sommets, 0);

        for (const sommet of this.grille.sommets) {
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    if (
                        y !== 0 ^ x !== 0
                        && sommet.y + y >= 0
                        && sommet.x + x >= 0
                        && sommet.y + y < this.grille.nb_lignes
                        && sommet.x + x < this.grille.nb_colonnes
                    ) {
                        const sommet_voisin = this.grille.sommet(sommet.x + x, sommet.y + y);

                        matrice_adjacence
                        [sommet.indice(this.grille.nb_colonnes)]
                        [sommet_voisin.indice(this.grille.nb_colonnes)]
                            = sommet_voisin.valeur;
                    }
                }
            }
        }

        return matrice_adjacence;
    }

    calculer_distance_minimale(sommet_source, sommet_destination) {
        const { chemins, distances } = this.calculer_distances_minimales(sommet_source);

        return {
            chemin: chemins[sommet_destination.indice(this.grille.nb_colonnes)],
            distance: distances[sommet_destination.indice(this.grille.nb_colonnes)]
        };
    }

    calculer_distances_minimales(sommet_source) {
        const indice_sommet_source = sommet_source.indice(this.grille.nb_colonnes);

        if (this.distances_minimales[indice_sommet_source] === null) {
            this.distances_minimales[indice_sommet_source] = this.dijkstra(sommet_source);
        }

        return this.distances_minimales[indice_sommet_source];
    }


    dijkstra(sommet_source) {
        const sommets_traites = Outils.array(this.grille.nb_sommets, false);

        const chemins = Outils.array(this.grille.nb_sommets, []);

        const distances = Outils.array(this.grille.nb_sommets - 1, Number.MAX_SAFE_INTEGER);
        distances[sommet_source.indice(this.grille.nb_colonnes)] = 0;

        _.times(this.grille.nb_sommets, () => {
            const sommet_courant = this.sommet_distance_minimale_non_traite(distances, sommets_traites);

            if (sommet_courant !== null) {
                const indice_sommet_courant = sommet_courant.indice(this.grille.nb_colonnes);

                sommets_traites[indice_sommet_courant] = true;

                _.times(this.grille.nb_sommets, indice_sommet_boucle => {
                    if (
                        this.matrice_adjacence[indice_sommet_courant][indice_sommet_boucle] > 0
                        && !sommets_traites[indice_sommet_boucle]
                        && distances[indice_sommet_boucle] > distances[indice_sommet_courant] + this.matrice_adjacence[indice_sommet_courant][indice_sommet_boucle]
                    ) {
                        const { x, y } = Sommet.coordonnees(indice_sommet_boucle, this.grille.nb_colonnes);

                        chemins[indice_sommet_boucle]
                            = [...chemins[indice_sommet_courant], this.grille.sommet(x, y)];

                        distances[indice_sommet_boucle]
                            = distances[indice_sommet_courant] + this.matrice_adjacence[indice_sommet_courant][indice_sommet_boucle];
                    }
                });
            }
        });

        return { chemins, distances };
    }

    sommet_distance_minimale_non_traite(distances, sommets_traites) {
        let sommet = null;
        let distance_minimale = Number.MAX_SAFE_INTEGER;

        _.times(this.grille.nb_sommets, indice_sommet => {
            if (!sommets_traites[indice_sommet] && distances[indice_sommet] < distance_minimale) {
                const { x, y } = Sommet.coordonnees(indice_sommet, this.grille.nb_colonnes);
                sommet = this.grille.sommet(x, y);

                distance_minimale = distances[indice_sommet];
            }
        });

        return sommet;
    }
}

export default Graphe;