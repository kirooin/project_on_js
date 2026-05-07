import {HttpUtils} from "../../../utils/http-utils";

export class ExpensesView {
    constructor() {

        this.row = document.getElementById('row')
        if (this.row) {
            this.getExpenses().then();
        }


    }

    async getExpenses() {
        const result = await HttpUtils.request('/categories/expense');

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message)
            return alert('Возникла ошибка при запросе расходов. Обратитесь в поддержку')
        }

        this.showExpenses(result.response);
    }


    showExpenses(expenses) {
        this.row.innerHTML = '';
        this.createCards(expenses);
        this.createAddCard();
        console.log(expenses);
        this.initDeleteButtons();
    }




    createCards(expenses) {
        expenses.forEach(expense => {
            const col = document.createElement('div');
            col.classList.add('col');

            const card = document.createElement('div');
            card.classList.add('card');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const cardTittle = document.createElement('div');
            cardTittle.classList.add('card-tittle', 'custom-card-title-text');
            cardTittle.innerText = expense.title;

            const btnGroup = document.createElement('div');
            btnGroup.classList.add('btn-group', 'pb-2');

            const linkEdit = document.createElement('a');
            linkEdit.href = '/#/expenses/edit?id=' + expense.id;
            linkEdit.classList.add('card-link', 'text-decoration-none');
            const btnEdit = document.createElement('button');
            btnEdit.classList.add('btn', 'btn-primary');
            btnEdit.innerText = 'Редактировать';

            const linkDelete = document.createElement('a');
            linkDelete.href = 'javascript:void(0)';
            linkDelete.setAttribute('id', 'linkDelete-' + expense.id);
            linkDelete.classList.add('card-link', 'text-decoration-none', 'link-delete');
            const btnDelete = document.createElement('button');
            btnDelete.setAttribute('data-bs-toggle', 'modal');
            btnDelete.setAttribute('data-bs-target', '#deleteModal');
            btnDelete.classList.add('btn', 'btn-danger');
            btnDelete.innerText = 'Удалить';


            linkEdit.appendChild(btnEdit)
            linkDelete.appendChild(btnDelete);
            btnGroup.appendChild(linkEdit);
            btnGroup.appendChild(linkDelete);
            cardBody.appendChild(cardTittle);
            cardBody.appendChild(btnGroup);
            card.appendChild(cardBody);
            col.appendChild(card);

            return this.row.appendChild(col)

        })
    }

    createAddCard() {
        const col = document.createElement('div');
        col.className = 'col';

        const link = document.createElement('a');
        link.href = '/#/expenses/create';
        link.className = 'text-decoration-none';

        const card = document.createElement('div');
        card.className = 'card';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex justify-content-center align-items-center';
        cardBody.style.height = '120px';

        const icon = document.createElement('i');
        icon.className = 'bi bi-plus fs-1';

        cardBody.appendChild(icon);
        card.appendChild(cardBody);
        link.appendChild(card);
        col.appendChild(link);

        return this.row.appendChild(col);
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
        history.pushState(null, '', '#/expenses?id=' + buttonId);
        const acceptBtn = document.getElementById('accept-delete');
        if (acceptBtn) {
            acceptBtn.href = '#/expenses/delete?id=' + buttonId;
        }
    }


}