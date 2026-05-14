import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";

export class Balance {
    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
           return location.href = "/#/login";
        }
        this.getBalance().then();
        this.balance = document.getElementById('layout-balance');
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance')

        if (result.redirect) {
           return location.href = result.redirect
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку')
        }
        this.balance.innerText = result.response.balance + '$';
    }
}