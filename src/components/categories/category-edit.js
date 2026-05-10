import {HttpUtils} from "../../utils/http-utils";

export class CategoryEdit {
    constructor(category) {
        this.category = category;
        this.id = location.hash.split('=')[1];
        if (!this.id) {
            return location.href = '/#/';
        }
        this.titleCategory = document.getElementById('title-category');

        this.getTitle(this.id).then();
        document.getElementById('save-btn').addEventListener('click', this.updateTitle.bind(this));

        this.title = document.getElementById('edit-title-category')
        if (this.category === 'income') {
            this.title.innerText = 'Редактирование категории доходов'
        } else {
            this.title.innerText = 'Редактирование категории расходов'
        }
    }

    async getTitle(id) {
        const result = await HttpUtils.request('/categories/' + this.category +'/' + id)

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message)
            return alert('Возникла ошибка при запросе расходов. Обратитесь в поддержку')
        }

        this.titleCategory.value = result.response.title;
    }

    async updateTitle() {
        await HttpUtils.request('/categories/' + this.category +'/' + this.id, 'PUT', true, {
            title: this.titleCategory.value,
        });

        location.href = '/#/' + this.category;
    }

}