import {HttpUtils} from "../../utils/http-utils";
import {CategoryType} from "../../types/category.type";
import {BalanceData} from "../../types/balance-response.type";
import {RequestResultType} from "../../types/request-result.type";
import {PostResponseType} from "../../types/post-response.type";

export class OperationCreate {
    readonly category: string | undefined;
    readonly categoriesElement: HTMLSelectElement | null = null;
    readonly categoryElement: HTMLSelectElement | null = null;
    readonly amountElement: HTMLInputElement | null = null;
    readonly dateElement: HTMLInputElement | null = null;
    readonly commentElement: HTMLInputElement | null = null;
    readonly amountError: HTMLElement | null = null;
    readonly processBtn: HTMLElement | null = null;
    private balance: number | null = null;

    constructor() {
        this.category = window.location.href.split('/').pop()

        this.categoriesElement = document.getElementById('select-categories') as HTMLSelectElement | null;
        this.categoryElement = document.getElementById('select-category') as HTMLSelectElement | null;
        this.amountElement = document.getElementById('amount-input') as HTMLInputElement | null;
        this.dateElement = document.getElementById('date-input') as HTMLInputElement | null;
        this.commentElement = document.getElementById('comm-input') as HTMLInputElement | null;
        this.amountError = document.getElementById('amount-error')
        this.processBtn = document.getElementById('process-btn')
        this.showInputs().then();

        if (this.processBtn) {
            this.processBtn.addEventListener('click', this.createOperation.bind(this))
        }
    }


    private async showInputs() {
        if (this.categoriesElement) {
            this.categoriesElement.disabled = true;
            switch (this.category) {
                case 'income':
                    this.categoriesElement.value = 'income';
                    break;
                case 'expense':
                    this.categoriesElement.value = 'expense';
                    break;
            }
        }
        await this.getBalance()
        const categories: CategoryType[] = await this.getCategories(this.category);
        if (categories) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.setAttribute('id', String(category.id));
                option.value = String(category.id);
                option.text = category.title;
                if (this.categoryElement) {
                    this.categoryElement.appendChild(option);
                }
            })

        } else {
            return location.href = '/#/login'
        }


    }

    private async getCategories(category: string | undefined) {
        const result = await HttpUtils.request('/categories/' + category);

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку')
        }

        return result.response;
    }

    private async getBalance() {
        const result: RequestResultType<BalanceData> = await HttpUtils.request('/balance');

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку')
        }
        this.balance = result.response.balance;
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (
            this.amountElement &&
            this.amountElement.nextElementSibling &&
            this.amountElement.value &&
            parseFloat(this.amountElement.value) > 0
        ) {
            this.amountElement.classList.remove('is-invalid');
            (this.amountElement.nextElementSibling as HTMLElement).classList.remove('border-red');
        } else {
            this.amountElement?.classList.add('is-invalid');
            (this.amountElement?.nextElementSibling as HTMLElement)?.classList?.add('border-red');

            if (this.amountError) {
                this.amountError.innerText = this.amountElement?.value ? 'Сумма должна быть больше 0' : 'Введите сумму';
            }
            isValid = false;
        }

        if (
            isValid &&
            this.amountElement?.value &&
            parseFloat(this.amountElement.value) > 0
        ) {
            if (!this.checkBalance()) {
                isValid = false;
            }
        }

        if (this.dateElement?.value) {
            this.dateElement.classList.remove('is-invalid');
            (this.dateElement.nextElementSibling as HTMLElement)?.classList?.remove('border-red');
        } else {
            this.dateElement?.classList.add('is-invalid');
            (this.dateElement?.nextElementSibling as HTMLElement)?.classList?.add('border-red');
            isValid = false;
        }

        if (this.commentElement?.value && this.commentElement.value.trim() !== '') {
            this.commentElement.classList.remove('is-invalid');
            (this.commentElement.nextElementSibling as HTMLElement)?.classList?.remove('border-red');
        } else {
            this.commentElement?.classList.add('is-invalid');
            (this.commentElement?.nextElementSibling as HTMLElement)?.classList?.add('border-red');
            isValid = false;
        }

        return isValid;
    }

    private checkBalance():  boolean | undefined {
        if (this.category === 'income') {
            return true;
        }
        if (this.balance && this.amountElement && this.amountElement.nextElementSibling && this.amountError) {
            if (this.balance < Number(this.amountElement.value)) {
                this.amountElement.classList.add('is-invalid');
                this.amountElement.nextElementSibling.classList.add('border-red');
                this.amountError.innerText = 'Расход не может быть больше текущего баланса';
                return false;
            }
            return true;
        }

    }

    private async createOperation() {
        const createdData = {
            type: this.category,
            amount: this.amountElement?.value,
            date: this.dateElement?.value,
            comment: this.commentElement?.value,
            category_id: Number(this.categoryElement?.value)
        }
        if (this.validateForm()) {
            const result: RequestResultType<PostResponseType> = await HttpUtils.request('/operations', 'POST', true, createdData)

            if (result.redirect) {
                location.href = result.redirect;
            }

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при создании операции. Обратитесь в поддержку')
            }


            location.href = '/#/income-expense'

        }
    }

}