import {HttpUtils} from "../../../utils/http-utils";

export class ExpensesDelete {
    constructor() {

        this.id = location.hash.split('=')[1];

        if (!this.id) {
            return location.href = '/#/';
        }

        this.deleteExpense(this.id).then();
    }


    async deleteExpense(id) {
        await HttpUtils.request('/categories/expense/' + id, 'DELETE', true)
        location.href = '/#/expenses';
    }
}