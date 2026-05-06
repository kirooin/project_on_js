import {HttpUtils} from "../../../utils/http-utils";

export class ExpensesCreate {
    constructor() {
        document.getElementById('create-btn').addEventListener('click', this.createExpense.bind(this));
    }

   async createExpense() {
       const title =  document.getElementById('title-expense');
       await HttpUtils.request('/categories/expense', 'POST', true, {
           title: title.value
       })
       location.href = '/#/expenses';
    }
}