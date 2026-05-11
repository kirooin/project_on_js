import {HttpUtils} from "../../utils/http-utils";

export class OperationCreate {
    constructor() {
        this.category = window.location.href.split('/').pop()

        this.categoriesElement = document.getElementById('select-categories');
        this.categoryElement = document.getElementById('select-category');
        this.amountElement = document.getElementById('amount-input');
        this.dateElement = document.getElementById('date-input');
        this.commentElemet = document.getElementById('comm-input');

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

    validateForm() {
        let isValid = true;

        if (this.amountElement.value) {
            this.amountElement.classList.remove('is-invalid');
            this.amountElement.nextElementSibling.classList.remove('border-red');
        } else {
            this.amountElement.classList.add('is-invalid');
            this.amountElement.nextElementSibling.classList.add('border-red');
            isValid = false;
        }

        if (this.dateElement.value) {
            this.dateElement.classList.remove('is-invalid');
            this.dateElement.nextElementSibling.classList.remove('border-red');
        } else {
            this.dateElement.classList.add('is-invalid');
            this.dateElement.nextElementSibling.classList.add('border-red');
            isValid = false;
        }
        if (this.commentElemet.value) {
            this.commentElemet.classList.remove('is-invalid');
            this.commentElemet.nextElementSibling.classList.remove('border-red');
        } else {
            this.commentElemet.classList.add('is-invalid');
            this.commentElemet.nextElementSibling.classList.add('border-red');
            isValid = false;
        }

        return isValid;
    }

  async checkBalance() {
        let isValid = true;
        if (this.category === 'income') {
           return isValid;
        }
        const result = await HttpUtils.request('/balance');

      if (result.error || !result.response || (result.response && (result.response.error || !result.response.balance))) {
          return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку')
      }

      if (result.response.balance < this.amountElement.value) {
          isValid =  false;
      }

      return isValid;
        // сделать проверку если мы на странице расхода и не должно быть что расход больше нашего баланса, логику прописал, осталось понять как и куда это поставить и проверить
    }

   async createOperation() {
        if (this.validateForm()) {
            const result = await HttpUtils.request('/operations', 'POST', true, {
                type: this.category,
                amount: this.amountElement.value,
                date: this.dateElement.value,
                comment: this.commentElemet.value,
                category_id: this.categoryElement.value,
            })

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при отправке категории. Обратитесь в поддержку')
            }

            location.href = '/#/income-expense'

        }
    }

}