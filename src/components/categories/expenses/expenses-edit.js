import {HttpUtils} from "../../../utils/http-utils";

export class ExpensesEdit {
    constructor() {



        this.id = location.hash.split('=')[1];
        if (!this.id) {
            return location.href = '/#/';
        }
        this.titleExpense = document.getElementById('title-expenses');

        this.getTitle(this.id).then();
        document.getElementById('save-btn').addEventListener('click', this.updateTitle.bind(this));
    }

    async getTitle(id) {
        const result = await HttpUtils.request('/categories/expense/' + id)

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message)
            return alert('Возникла ошибка при запросе расходов. Обратитесь в поддержку')
        }

        this.titleExpense.value = result.response.title;
    }

    async updateTitle() {
        await HttpUtils.request('/categories/expense/' + this.id, 'PUT', true, {
            title: this.titleExpense.value,
        });

        location.href = '/#/expenses';
    }
}