import {HttpUtils} from "../../utils/http-utils";

export class CategoryEdit {
    constructor(category) {
        this.category = category;
        this.id = location.hash.split('=')[1];
        if (!this.id) {
            return location.href = '/#/';
        }
        this.titleCategory = document.getElementById('title-category');
        this.title = document.getElementById('edit-title-category')

        this.cancelElement = document.getElementById('cancel-btn').href = '/#/' + this.category


        this.getTitle(this.id).then();
        document.getElementById('save-btn').addEventListener('click', this.updateTitle.bind(this));

        switch (this.category) {
            case 'income':
                this.title.innerText = 'Редактирование категории доходов'
                break;
            case 'expense':
                this.title.innerText = 'Редактирование категории расходов'
                break;
            default:
                this.title.innerText = 'Редактирование категории undefined'
        }
    }

    async getTitle(id) {
        const result = await HttpUtils.request('/categories/' + this.category + '/' + id)

        if (result.redirect) {
            location.href = result.redirect;
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе заголовка. Обратитесь в поддержку')
        }

        this.titleCategory.value = result.response.title;
    }

    async updateTitle() {
        const result = await HttpUtils.request('/categories/' + this.category + '/' + this.id, 'PUT', true, {
            title: this.titleCategory.value,
        });

        if (result.redirect) {
            location.href = result.redirect;
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при отправке заголовка категории. Обратитесь в поддержку')
        }

        location.href = '/#/' + this.category;
    }

}