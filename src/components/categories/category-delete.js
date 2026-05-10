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
        await HttpUtils.request('/categories/'+ this.category +'/' + id, 'DELETE', true)
        location.href = '/#/' + this.category;
    }
}