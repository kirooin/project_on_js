import {HttpUtils} from "../../utils/http-utils";

export class OperationDelete {
    constructor() {
        this.id = location.hash.split('=')[1];
        if (!this.id) {
            return location.href = '/#/income-expense';
        }
        this.deleteOperation().then()
    }

   async deleteOperation() {
       const result = await HttpUtils.request('/operations/' + this.id, 'DELETE', true)

       if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
           return alert('Возникла ошибка при удалении операции. Обратитесь в поддержку')
       }

       location.href = '/#/income-expense';
    }
}