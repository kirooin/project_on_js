import {HttpUtils} from "../../utils/http-utils";

export class IncomeExpense {
    constructor() {
        this.getOperations().then();
    }

    async getOperations() {
        const result = await HttpUtils.request('/operations')

        if (result.redirect) {
            return location.href = result.redirect
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку')
        }
        this.showOperations(result.response)
    }
    showOperations(operations) {
        // console.log(operations)
        const tbody = document.getElementById('operations');
        operations.forEach(operation => {
            const trElement = document.createElement('tr');

            trElement.insertCell().innerText = operation.id
            trElement.insertCell().innerText = operation.name
        })

    }
}