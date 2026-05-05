import {HttpUtils} from "../utils/http-utils";

export class Balance {
    constructor() {
        this.getBalance().then();
        this.balance = document.getElementById('layout-balance');
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance')
        this.balance.innerText = result.response.balance + '$';
    }
}