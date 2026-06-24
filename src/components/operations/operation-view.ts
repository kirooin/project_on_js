import {AuthUtils} from "../../utils/auth-utils";
import {OperationsManager} from "../services/operations-manager";
import {OperationType} from "../../types/operation-interval.type";

export class IncomeExpense {

    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            location.href = "/#/login";
            return;
        }

        const operationsManager = new OperationsManager()
        operationsManager.setOnDataReceived(data => {
            this.showOperations(data)
        })
    }


    private showOperations(operations: OperationType[]): void {
        const tbody = document.getElementById('operations') as HTMLElement;
        tbody.innerHTML = '';

        const sortOperations = operations.sort((a, b) => a.id - b.id);
        // const incomeArray = operations.filter(item => item.type === 'income');
        // const expenseArray = operations.filter(item => item.type === 'expense');

        sortOperations.forEach(operation => {
            const trElement = document.createElement('tr');

            trElement.insertCell().innerText = String(operation.id);

            let type = trElement.insertCell();
            switch (operation.type) {
                case 'income':
                    type.innerText = 'доход';
                    break;
                case 'expense':
                    type.innerText = 'расход';
                    break;
                default:
                    type.innerText = 'неизвестно';
            }

            if (type.innerText === 'расход') {
                type.classList.add('text-danger');
            } else if (type.innerText === 'доход') {
                type.classList.add('text-success');
            }

            trElement.insertCell().innerText = operation.category;
            trElement.insertCell().innerText = String(operation.amount);

            if (operation.date) {
                const date = new Date(operation.date);
                trElement.insertCell().innerText = date.toLocaleDateString('ru-RU');
            }

            trElement.insertCell().innerText = operation.comment || '';
            trElement.insertCell().innerHTML =
                '<a class="text-decoration-none text-black" href="/#/income-expense/edit?id=' + operation.id + '"><i class="bi bi-pencil me-2 cursor-pointer"></i></a>' +
                '<a class="text-decoration-none text-black" href="javascript:void(0)"><i id="operation-' + operation.id + '" class="bi bi-trash cursor-pointer link-delete" data-bs-toggle="modal" data-bs-target="#deleteModal"></i></a>';

            tbody.appendChild(trElement);
        });

        this.initDeleteButtons();
    }

    private initDeleteButtons(): void {
        const buttons = document.querySelectorAll('.link-delete');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleDeleteClick(e));
        });
    }

    private handleDeleteClick(e: Event): void {
        const button = e.currentTarget as HTMLElement;
        const buttonId = button.id.split('-')[1];
        const acceptBtn = document.getElementById('accept-delete') as HTMLAnchorElement;
        if (acceptBtn) {
            acceptBtn.href = '#/income-expense/delete?id=' + buttonId;
        }
    }
}