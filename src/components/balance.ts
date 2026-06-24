import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";
import {RequestResultType} from "../types/request-result.type";
import {BalanceData} from "../types/balance-response.type";

export class Balance {
    balance: HTMLElement | null = null;

    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            location.href = "/#/login";
            return;
        }

        this.balance = document.getElementById('layout-balance');
        this.getBalance().then();
    }

    private async getBalance(): Promise<void> {
        const result: RequestResultType<BalanceData> = await HttpUtils.request('/balance');

        if (result.redirect) {
            location.href = result.redirect;
            return;
        }

        if (result.error || !result.response || (result.response && !result.response)) {
            alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку');
            return;
        }

        if (this.balance) {
            this.balance.innerText = result.response.balance + '$';
        }
    }
}