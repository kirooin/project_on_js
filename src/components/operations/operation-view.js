import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";

export class IncomeExpense {
    constructor() {

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return location.href = "/#/login";
        }
        this.dateFilterFrom = 'today'

        this.period = location.hash.split('=')[1]

        if (this.period) {
            this.dateFilterFrom = this.period
        }

        this.startSpan = document.getElementById('startDateText')
        this.endSpan = document.getElementById('endDateText');

        document.getElementById('interval-btn').addEventListener('click', (e) => this.processIntervalBtn(e));


        this.initPeriodButtons(this.dateFilterFrom)
        this.getOperations(this.dateFilterFrom).then();
    }

    processIntervalBtn(e) {
        e.preventDefault();
    }


    initPeriodButtons(period) {
        const periodButtons = document.querySelectorAll('[data-period]');
        periodButtons.forEach(btn => {
            if (btn.dataset.period === period) {
                btn.classList.remove('btn-outline-secondary');
                btn.classList.add('btn-secondary');
            } else {
                btn.classList.add('btn-outline-secondary');
                btn.classList.remove('btn-secondary');
            }

            if (btn.dataset.period === 'interval') {
                console.log('на верном пути')
            }
        })
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
        this.startSpan.addEventListener('click', () => CommonUtils.makeEditable(this.startSpan))
        this.endSpan.addEventListener('click', () => CommonUtils.makeEditable(this.endSpan))

        const sortOperations = operations.sort((a, b) => {
            return a.id - b.id;
        })
        console.log(operations)
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
            if (operation.date) {
                const date = new Date(operation.date);
                trElement.insertCell().innerText = date.toLocaleDateString('ru-RU');
            }

            trElement.insertCell().innerText = operation.comment;
            trElement.insertCell().innerHTML =
                '<a class="text-decoration-none text-black" href="/#/income-expense/edit?id=' + operation.id + ' "><i class="bi bi-pencil me-2 cursor-pointer"></i></a>' +
                '<a class="text-decoration-none text-black" href="javascript:void(0)"><i id="operation-' + operation.id + '" class="bi bi-trash cursor-pointer link-delete" data-bs-toggle="modal" data-bs-target="#deleteModal"></i></a>';
            tbody.appendChild(trElement);
        })
        this.initDeleteButtons()
    }

    initDeleteButtons() {
        const buttons = document.querySelectorAll('.link-delete');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleDeleteClick(e))
        })
    }

    handleDeleteClick(e) {
        const button = e.currentTarget;
        const buttonId = button.id.split('-')[1];
        const acceptBtn = document.getElementById('accept-delete');
        if (acceptBtn) {
            acceptBtn.href = '#/income-expense/delete?id=' + buttonId;
        }

    }
}