import {HttpUtils} from "../../utils/http-utils";
import {RequestResultType} from "../../types/request-result.type";
import {PostResponseType} from "../../types/post-response.type";

export class CategoryCreate {
    readonly category: string;
    readonly title: HTMLInputElement | null;

    constructor(category: string) {
        this.category = category;

        document.getElementById('create-btn')?.addEventListener('click', this.createCategory.bind(this));
        this.title = document.getElementById('create-title-category') as HTMLInputElement

        if (this.category === 'income' && this.title) {
            this.title.innerText = 'Создание категории доходов'
        } else {
            if (this.title) this.title.value = 'Создание категории расходов'
        }
    }

    async createCategory(): Promise<void> {
        const title = document.getElementById('title-category') as HTMLInputElement;
        const result: RequestResultType<PostResponseType> = await HttpUtils.request('/categories/' + this.category, 'POST', true, {
            title: title.value,
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