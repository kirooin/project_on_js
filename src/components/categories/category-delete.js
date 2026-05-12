import {HttpUtils} from "../../utils/http-utils";

export class CategoryDelete {
    constructor(category) {
        this.category = category;
        this.id = location.hash.split('=')[1];

        if (!this.id) {
            return location.href = '/#/';
        }

        this.deleteCategory(this.id).then();
    }

    async deleteCategory(id) {
      const result =   await HttpUtils.request('/categories/' + this.category + '/' + id, 'DELETE', true)

        if (result.redirect ) {
            location.href = result.redirect;
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку')
        }

        location.href = '/#/' + this.category;
    }
}