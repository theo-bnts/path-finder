const _ = require('lodash');
const ExcelJS = require('exceljs');

class Feuille {
    constructor(chemin, index) {
        this.chemin_fichier = chemin;
        this.fichier = new ExcelJS.Workbook();
        this.index = index;
        this.feuille = null;
    }

    async lire() {
        await this.fichier.xlsx.readFile(this.chemin_fichier);

        this.feuille = this.fichier.getWorksheet(this.index);
    }

    nom_colonne(index) {
        let nom = '';

        while (index >= 0) {
            nom = String.fromCharCode(65 + (index % 26)) + nom;
            index = Math.floor(index / 26) - 1;
        }

        return nom;
    }

    index_colonne(nom) {
        let valeur = 0;

        for (const lettre of nom) {
            valeur = valeur * 26 + lettre.charCodeAt(0) - 64;
        }

        return valeur - 1;
    }

    decoder_plage(plage) {
        const expression = /([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/;
        const [colonne_debut, ligne_debut, colonne_fin, ligne_fin] = plage.match(expression).slice(1);
        
        return {
            debut: {
                x: this.index_colonne(colonne_debut),
                y: parseInt(ligne_debut) - 1
            },
            fin: {
                x: this.index_colonne(colonne_fin),
                y: parseInt(ligne_fin) - 1
            }
        };
    }

    vers_tableau(plage) {
        const { debut, fin } = this.decoder_plage(plage);

        const tableau = [];

        for (let y = debut.y; y <= fin.y; y++) {
            const ligne = [];

            for (let x = debut.x; x <= fin.x; x++) {
                const nom_cellule = this.nom_colonne(x) + (y + 1);
                const cellule = this.feuille.getCell(nom_cellule);

                ligne.push(cellule.value);
            }

            tableau.push(ligne);
        }

        return tableau;
    }

    surbrillance_cellule(plage, x, y) {
        const { debut } = this.decoder_plage(plage);

        const nom_cellule = this.nom_colonne(debut.x + x) + (debut.y + y + 1);

        const cellule = this.feuille.getCell(nom_cellule);

        cellule.value = '( ' + cellule.value + ' )';

        cellule.style = {
            ...cellule.style,
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: cellule.fill.pattern === 'none'
                        ? 'FFC000'
                        : cellule.fill.fgColor.argb
                }
            }
        };
    }

    ecrire(chemin) {
        this.fichier.xlsx.writeFile(chemin);
    }
}

module.exports = Feuille;
