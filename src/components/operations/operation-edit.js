export class OperationEdit {
    constructor() {
        this.id = location.hash.split('=')[1];
        if (!this.id) {
            return location.href = '/#/income-expense';
        }
        // написать логику
    }
}