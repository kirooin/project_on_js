import {HttpUtils} from "../../utils/http-utils";
import {RequestResultType} from "../../types/request-result.type";
import {CategoryType} from "../../types/category.type";
import {PostResponseType} from "../../types/post-response.type";

export class CategoryEdit {
    readonly category: string | undefined;
    readonly id: string | undefined;
    readonly titleCategory: HTMLInputElement | null = null;
    readonly title: HTMLElement | null = null;
    readonly cancelElement: HTMLAnchorElement | null = null;

    constructor(category: string) {
        this.category = category;
        this.id = location.hash.split('=')[1];
        if (!this.id) {
            location.href = '/#/';
            return
        }
        this.titleCategory = document.getElementById('title-category') as HTMLInputElement
        this.title = document.getElementById('edit-title-category')

        this.cancelElement = document.getElementById('cancel-btn') as HTMLAnchorElement | null;
        if (this.cancelElement) {
            this.cancelElement.href = '/#/' + this.category
        }

        this.getTitle(this.id).then();
        document.getElementById('save-btn')?.addEventListener('click', this.updateTitle.bind(this));

        switch (this.category) {
            case 'income':
                if (this.title) this.title.innerText = 'Редактирование категории доходов'
                break;
            case 'expense':
                if (this.title) this.title.innerText = 'Редактирование категории расходов'
                break;
            default:
                if (this.title) this.title.innerText = 'Редактирование категории undefined'
        }
    }

    private async getTitle(id: string): Promise<void> {
        const result: RequestResultType<CategoryType> = await HttpUtils.request('/categories/' + this.category + '/' + id)

        if (result.redirect) {
            location.href = result.redirect;
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе заголовка. Обратитесь в поддержку')
        }

        if (this.titleCategory) this.titleCategory.value = result.response.title;
    }

    private async updateTitle(): Promise<void> {
        const result: RequestResultType<PostResponseType> = await HttpUtils.request('/categories/' + this.category + '/' + this.id, 'PUT', true, {
            title: this.titleCategory?.value,
        });

        if (result.redirect) {
            location.href = result.redirect;
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            console.log('ошибка при изменении заголовка');
            return alert('Возникла ошибка при отправке заголовка категории. Обратитесь в поддержку')
        }

        location.href = '/#/' + this.category;
    }

}