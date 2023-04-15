const _ = require('lodash');
const XLSX = require('xlsx');

class Feuille {
    constructor(fichier, nom) {
        this.feuille = XLSX.readFile(fichier).Sheets[nom];
    }

    vers_tableau(indices_plage) {
        const plage = XLSX.utils.decode_range(indices_plage);
        const entetes = _.range(plage.s.c, plage.e.c);

        return XLSX.utils
            .sheet_to_json(this.feuille, { range: plage, header: entetes })
            .map(y => Object.values(y));
    }
}

module.exports = Feuille;