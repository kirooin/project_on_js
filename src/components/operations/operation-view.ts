import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";

export class IncomeExpense {
    constructor() {

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            location.href = "/#/login";
            return
        }
        this.dateFilterFrom = 'today'

        this.period = location.hash.split('=')[1]

        if (this.period) {
            this.dateFilterFrom = this.period
        }

        this.startSpan = document.getElementById('startDateText')
        this.endSpan = document.getElementById('endDateText');


        this.initPeriodButtons(this.dateFilterFrom)
        this.getOperations(this.dateFilterFrom).then();
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

        })
    }

    async getOperations(period) {
        if (period === 'interval') {
            const input = CommonUtils.createDateInput('input-1')
            const input2 = CommonUtils.createDateInput('input-2')

            this.startSpan.parentNode.replaceChild(input, this.startSpan);
            this.endSpan.parentNode.replaceChild(input2, this.endSpan);

            if (input && input2) {

                await input.addEventListener('input', this.checkAndExecute.bind(this));
                await input2.addEventListener('input', this.checkAndExecute.bind(this));
            }

        } else {
            const result = await HttpUtils.request('/operations?period=' + period)

            if (result.redirect) {
                return location.href = '/#/login'
            }

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку')
            }
            this.showOperations(result.response)
        }


    }

    async checkAndExecute() {
        this.input = document.getElementById('input-1')
        this.input2 = document.getElementById('input-2')
        if (this.input.value && this.input2.value) {
            const result = await HttpUtils.request('/operations?period=interval&dateFrom=' + this.input.value + '&dateTo=' + this.input2.value)

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку')
            }

            this.showOperations(result.response)
        }
    }

    showOperations(operations) {
        const tbody = document.getElementById('operations');
        tbody.innerHTML = ''
        const sortOperations = operations.sort((a, b) => {
            return a.id - b.id;
        })
        const incomeArray = operations.filter(item => item.type === 'income');
        const expenseArray = operations.filter(item => item.type === 'expense');

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