import {HttpUtils} from "../utils/http-utils";

export class Balance {
    constructor() {
        this.getBalance().then();
        this.balance = document.getElementById('layout-balance');
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance')

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.balance))) {
            return alert('Возникла ошибка при запросе заказов. Обратитесь в поддержку')
        }
        this.balance.innerText = result.response.balance + '$';
    }
}