import {HttpUtils} from "../../utils/http-utils";
import {RequestResultType} from "../../types/request-result.type";
import {DeleteResponseType} from "../../types/delete-response.type";

export class OperationDelete {
    readonly id: string | undefined;

    constructor() {
        this.id = location.hash.split('=')[1];
        if (!this.id) {
            location.href = '/#/income-expense';
            return
        }
        this.deleteOperation().then()
    }

    private async deleteOperation(): Promise<void> {
        const result:RequestResultType<DeleteResponseType> = await HttpUtils.request('/operations/' + this.id, 'DELETE', true)

        if (result.error || !result.response || (result.response && (result.response.error || !result.response || result.response.message))) {
            return alert('Возникла ошибка при удалении операции. Обратитесь в поддержку')
        }

        location.href = '/#/income-expense';
    }
}