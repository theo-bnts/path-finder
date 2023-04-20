class Bonus {
    static valeur(coordonnes_bonus, valeurs_bonus, x_, y_) {
        const index = coordonnes_bonus.findIndex(([x, y]) => x === x_ && y === y_);

        if (index >= 0) {
            return valeurs_bonus[index];
        }
        else {
            return 0;
        }
    }
}

export default Bonus;