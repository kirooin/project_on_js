import {HttpUtils} from "../../utils/http-utils";
import {RequestResultType} from "../../types/request-result.type";
import {PostRequestType} from "../../types/post-request.type";

export class CategoryCreate {
    readonly category: string;
    readonly title: HTMLElement | null;

    constructor(category: string) {
        this.category = category;

        document.getElementById('create-btn')?.addEventListener('click', this.createCategory.bind(this));
        this.title = document.getElementById('create-title-category')

        if (this.category === 'income' && this.title) {
            this.title.innerText = 'Создание категории доходов'
        } else {
            if (this.title) this.title.innerText = 'Создание категории расходов'
        }
    }

    async createCategory(): Promise<void> {
        const title = document.getElementById('title-category');
        const result: RequestResultType<PostRequestType> = await HttpUtils.request('/categories/' + this.category, 'POST', true, {
            title: title?.innerText,
        })

        if (result.redirect) {
            location.href = result.redirect
            return
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при создании категории. Обратитесь в поддержку')
        }

        location.href = '/#/' + this.category;
    }
}