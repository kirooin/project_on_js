import {HttpUtils} from "../../utils/http-utils";
import {RequestResultType} from "../../types/request-result.type";
import {PostRequestType} from "../../types/post-request.type";

export class CategoryDelete {
    readonly category: string;
    readonly id: string | undefined;

    constructor(category: string) {
        this.category = category;
        this.id = location.hash.split('=')[1];

        if (!this.id) {
            location.href = '/#/';
            return
        }

        this.deleteCategory(this.id).then();
    }

   private async deleteCategory(id: string): Promise<void> {
        const result: RequestResultType<PostRequestType> = await HttpUtils.request('/categories/' + this.category + '/' + id, 'DELETE', true)

        if (result.redirect) {
            location.href = result.redirect;
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку')
        }

        location.href = '/#/' + this.category;
    }
}