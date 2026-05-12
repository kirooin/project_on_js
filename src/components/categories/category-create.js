import {HttpUtils} from "../../utils/http-utils";

export class CategoryCreate {
    constructor(category) {
        this.category = category;
        document.getElementById('create-btn').addEventListener('click', this.createCategory.bind(this));
        this.title = document.getElementById('create-title-category')

        if (this.category === 'income') {
            this.title.innerText = 'Создание категории доходов'
        } else {
            this.title.innerText = 'Создание категории расходов'
        }
    }

    async createCategory() {
        const title = document.getElementById('title-category');
        const result = await HttpUtils.request('/categories/' + this.category, 'POST', true, {
            title: title.value
        })

        if (result.redirect) {
            return location.href = result.redirect
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при создании категории. Обратитесь в поддержку')
        }

        location.href = '/#/' + this.category;
    }
}