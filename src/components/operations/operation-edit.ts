import {HttpUtils} from "../../utils/http-utils";
import {OperationType} from "../../types/operation-interval.type";
import {RequestResultType} from "../../types/request-result.type";
import {CategoryType} from "../../types/category.type";

export class OperationEdit {
    readonly id: string | undefined;
    readonly categoriesElement: HTMLSelectElement | null = null;
    readonly categoryElement: HTMLSelectElement | null = null;
    readonly amountElement: HTMLInputElement | null = null;
    readonly dateElement: HTMLInputElement | null = null;
    readonly commentElement: HTMLInputElement | null = null;
    readonly amountError: HTMLElement | null = null;
    readonly processBtn: HTMLElement | null = null;
    private balance: number | null = null;
    private type: string | null = null;

    constructor() {
        this.id = location.hash.split('=')[1];
        if (!this.id) {
            location.href = '/#/income-expense';
            return
        }
        this.categoriesElement = document.getElementById('select-categories') as HTMLSelectElement | null;
        this.categoryElement = document.getElementById('select-category') as HTMLSelectElement | null;
        this.amountElement = document.getElementById('amount-input') as HTMLInputElement | null;
        this.dateElement = document.getElementById('date-input') as HTMLInputElement | null;
        this.commentElement = document.getElementById('comm-input') as HTMLInputElement | null;
        this.amountError = document.getElementById('amount-error')
        this.processBtn = document.getElementById('process-btn')
        this.getOperation().then();

        if (this.processBtn) {
            this.processBtn.addEventListener('click', this.updateOperation.bind(this))

        }
    }

    private async showInputs(operation: OperationType) {
        if (operation && this.categoriesElement) {
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

            if (this.amountElement && this.dateElement && this.commentElement) {
                this.amountElement.value = String(operation.amount);
                this.dateElement.value = operation.date;
                this.commentElement.innerHTML = operation.comment;
            }
        }
    }


    private async getOperation() {
        const result: RequestResultType<OperationType> = await HttpUtils.request('/operations/' + this.id)

        if (result.error || !result.response || (result.response && !result.response)) {
            return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку')
        }

        return this.showInputs(result.response);
    }

    private async getCategories(category: string) {
        const result = await HttpUtils.request('/categories/' + category);

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку')
        }

        return result.response
    }

    private showCategories(categories: CategoryType[]) {

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = String(category.id);
            option.innerText = category.title;
            if (this.categoryElement) {
                this.categoryElement.appendChild(option);
            }
        })
    }

    validateForm() {
        let isValid = true;

        if (this.amountElement && this.amountElement.nextElementSibling && this.amountElement.value && parseFloat(this.amountElement.value) > 0) {
            this.amountElement.classList.remove('is-invalid');
            this.amountElement.nextElementSibling.classList.remove('border-red');
        } else {
            this.amountElement?.classList.add('is-invalid');
            this.amountElement?.nextElementSibling?.classList.add('border-red');
            if (this.amountError) {
                this.amountError.innerText = this.amountElement?.value ? 'Сумма должна быть больше 0' : 'Введите сумму';
                isValid = false;
            }
        }

        if (isValid && this.amountElement?.value && parseFloat(this.amountElement.value) > 0) {
            if (!this.checkBalance()) {
                isValid = false;
            }
        }

        if (this.dateElement?.value) {
            this.dateElement.classList.remove('is-invalid');
            this.dateElement.nextElementSibling?.classList.remove('border-red');
        } else {
            this.dateElement?.classList.add('is-invalid');
            this.dateElement?.nextElementSibling?.classList.add('border-red');
            isValid = false;
        }

        if (this.commentElement?.value && this.commentElement.value.trim() !== '') {
            this.commentElement.classList.remove('is-invalid');
            this.commentElement.nextElementSibling?.classList.remove('border-red');
        } else {
            this.commentElement?.classList.add('is-invalid');
            this.commentElement?.nextElementSibling?.classList.add('border-red');
            isValid = false;
        }

        return isValid;
    }

    checkBalance() {
        if (this.type === 'income') {
            return true;
        }

        this.getBalance().then()

        if (this.balance && this.amountElement && this.amountError) {
            if (this.balance < Number(this.amountElement.value)) {
                this.amountElement.classList.add('is-invalid');
                this.amountElement.nextElementSibling?.classList.add('border-red');
                this.amountError.innerText = 'Расход не может быть больше текущего баланса';
                return false;
            }
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
            amount: this.amountElement?.value ? Number(this.amountElement.value) : 0,
            date: this.dateElement?.value || '',
            comment: this.commentElement?.value || '',
            category_id: this.categoryElement?.value ? Number(this.categoryElement.value) : null,
        }

        if (this.validateForm()) {
            const result = await HttpUtils.request('/operations/' + this.id, 'PUT', true, changedData)

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при создании операции. Обратитесь в поддержку')
            }

            location.href = '/#/income-expense'

        }
    }

}