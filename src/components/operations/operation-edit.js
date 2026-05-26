import {HttpUtils} from "../../utils/http-utils";

export class OperationEdit {
    constructor() {
        this.id = location.hash.split('=')[1];
        if (!this.id) {
            return location.href = '/#/income-expense';
        }
        this.categoriesElement = document.getElementById('select-categories');
        this.categoryElement = document.getElementById('select-category');
        this.amountElement = document.getElementById('amount-input');
        this.dateElement = document.getElementById('date-input');
        this.commentElemet = document.getElementById('comm-input');
        this.amountError = document.getElementById('amount-error')
        this.getOperation().then();

        document.getElementById('process-btn').addEventListener('click', this.updateOperation.bind(this))
    }

    async showInputs(operation) {
        if (operation) {
            this.categoriesElement.disabled = true;
            const option = document.createElement('option');
            switch (operation.type) {
                case 'income':
                    option.value = 'income';
                    option.innerText = 'Доход';
                    break;
                case 'expense':
                    option.value = 'expense';
                    option.innerText = 'Расход';
                    break;
                default:
                    option.value = '';
                    option.innerText = 'Неизвестно';
                    break;
            }
            this.categoriesElement.appendChild(option);

            const categories = await this.getCategories(operation.type).then();
            this.showCategories(categories)
            this.type = operation.type;

            this.amountElement.value = operation.amount;
            this.dateElement.value = operation.date;
            this.commentElemet.innerHTML = operation.comment;

        }
    }



    async getOperation() {
        const result = await HttpUtils.request('/operations/' + this.id)

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку')
        }

        return this.showInputs(result.response);
    }

    async getCategories(category) {
        const result = await HttpUtils.request('/categories/' + category);

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку')
        }

        return result.response
    }

    showCategories(categories, operation) {

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.innerText = category.title;
            this.categoryElement.appendChild(option);
        })
    }

    validateForm() {
        let isValid = true;

        if (this.amountElement.value && parseFloat(this.amountElement.value) > 0) {
            this.amountElement.classList.remove('is-invalid');
            this.amountElement.nextElementSibling.classList.remove('border-red');
        } else {
            this.amountElement.classList.add('is-invalid');
            this.amountElement.nextElementSibling.classList.add('border-red');
            this.amountError.innerText = this.amountElement.value ? 'Сумма должна быть больше 0' : 'Введите сумму';
            isValid = false;
        }

        if (isValid && this.amountElement.value && parseFloat(this.amountElement.value) > 0) {
            if (this.checkBalance() === false) {
                isValid = false;
            }
        }

        if (this.dateElement.value) {
            this.dateElement.classList.remove('is-invalid');
            this.dateElement.nextElementSibling.classList.remove('border-red');
        } else {
            this.dateElement.classList.add('is-invalid');
            this.dateElement.nextElementSibling.classList.add('border-red');
            isValid = false;
        }

        if (this.commentElemet.value && this.commentElemet.value.trim() !== '') {
            this.commentElemet.classList.remove('is-invalid');
            this.commentElemet.nextElementSibling.classList.remove('border-red');
        } else {
            this.commentElemet.classList.add('is-invalid');
            this.commentElemet.nextElementSibling.classList.add('border-red');
            isValid = false;
        }

        return isValid;
    }

    checkBalance() {
        if (this.type === 'income') {
            return true;
        }

        this.getBalance().then()

        if (this.balance < this.amountElement.value) {
            this.amountElement.classList.add('is-invalid');
            this.amountElement.nextElementSibling.classList.add('border-red');
            this.amountError.innerText = 'Расход не может быть больше текущего баланса';
            return false;
        }

        return true;
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance');

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку')
        }
       return this.balance = result.response.balance;
    }




    async updateOperation() {
        const changedData = {
            type: this.type,
            amount: Number(this.amountElement.value),
            date: this.dateElement.value,
            comment: this.commentElemet.value,
            category_id: Number(this.categoryElement.value),
        }
        console.log(changedData)

        if (this.validateForm()) {
            const result = await HttpUtils.request('/operations/' + this.id, 'PUT', true, changedData)

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при создании операции. Обратитесь в поддержку')
            }

            location.href = '/#/income-expense'

        }
    }

}