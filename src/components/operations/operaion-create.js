import {HttpUtils} from "../../utils/http-utils";

export class OperationCreate {
    constructor() {
        this.category = window.location.href.split('/').pop()

        this.categoriesElement = document.getElementById('select-categories');
        this.categoryElement = document.getElementById('select-category');
        this.amountElement = document.getElementById('amount-input');
        this.dateElement = document.getElementById('date-input');
        this.commentElemet = document.getElementById('comm-input');
        this.amountError = document.getElementById('amount-error')
        this.showInputs().then();


        document.getElementById('process-btn').addEventListener('click', this.createOperation.bind(this))
    }


    async showInputs() {

        this.categoriesElement.disabled = true;
        switch (this.category) {
            case 'income':
                this.categoriesElement.value = 'income';
                break;
            case 'expense':
                this.categoriesElement.value = 'expense';
                break;
        }
        await this.getBalance()
        const categories = await this.getCategories(this.category);
        console.log(categories)
        if (categories) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.setAttribute('id', category.id);
                option.value = category.id;
                option.text = category.title;
                this.categoryElement.appendChild(option);
            })

        } else {
            return location.href = '/#/login'
        }


    }

    async getCategories(category) {
        const result = await HttpUtils.request('/categories/' + category);

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку')
        }

        return result.response;
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance');

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку')
        }
        this.balance = result.response.balance;
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
        if (this.category === 'income') {
            return true;
        }

        if (this.balance < this.amountElement.value) {
            this.amountElement.classList.add('is-invalid');
            this.amountElement.nextElementSibling.classList.add('border-red');
            this.amountError.innerText = 'Расход не может быть больше текущего баланса';
            return false;
        }

        return true;

    }

    async createOperation() {
        const createdData = {
            type: this.category,
            amount: this.amountElement.value,
            date: this.dateElement.value,
            comment: this.commentElemet.value,
            category_id: Number(this.categoryElement.value)
        }
        if (this.validateForm()) {
            console.log(createdData)
            const result = await HttpUtils.request('/operations', 'POST', true, createdData)

            if (result.redirect) {
                location.href = result.redirect;
            }

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при создании операции. Обратитесь в поддержку')
            }

            console.log(result.response)

            location.href = '/#/income-expense'

        }
    }

}