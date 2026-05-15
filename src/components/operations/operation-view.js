import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";

export class IncomeExpense {
    constructor() {

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return location.href = "/#/login";
        }

        this.dateFilterFrom = 'all'

        this.getOperations(this.dateFilterFrom).then();
    }

    async getOperations(period) {
        const result = await HttpUtils.request('/operations?period=' + period)

        if (result.redirect) {
            return location.href = '/#/login'
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку')
        }
        this.showOperations(result.response)
    }

    showOperations(operations) {
        console.log(operations)
        const sortOperations = operations.sort((a, b) => {
            return a.id - b.id;
        })
        const tbody = document.getElementById('operations');
        sortOperations.forEach(operation => {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = operation.id
            let type;
            switch (operation.type) {
                case 'income':
                    type = trElement.insertCell()
                    type.innerText = 'доход';
                    break;
                case 'expense':
                    type = trElement.insertCell();
                    type.innerText = 'расход';
                    break;
                default:
                    type = trElement.insertCell();
                    type.innerText = 'неизвестно';

            }

            switch (type.innerText) {
                case 'расход':
                    type.classList.add('text-danger');
                    break;
                case 'доход':
                    type.classList.add('text-success');
                    break;
            }
            trElement.insertCell().innerText = operation.category;
            trElement.insertCell().innerText = operation.amount;
            trElement.insertCell().innerText = operation.date;
            trElement.insertCell().innerText = operation.comment;
            trElement.insertCell().innerHTML =
                '<a class="text-decoration-none text-black" href="/#/income-expense/edit?id=' + operation.id + ' "><i class="bi bi-pencil me-2 cursor-pointer"></i></a>' +
                '<a id="delete-operation-' + operation.id + '   " class="text-decoration-none text-black" href="javascript:void(0)"><i class="bi bi-trash cursor-pointer" data-bs-toggle="modal" data-bs-target="#deleteModal"></i></a>';
            tbody.appendChild(trElement);
        })

    }
}