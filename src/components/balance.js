import {HttpUtils} from "../utils/http-utils";

export class Balance {
    constructor() {
        this.getBalance().then();
        this.balance = document.getElementById('layout-balance');
        console.log('Баланс!')
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance')
        console.log(result.response.balance)
        this.balance.innerText = result.response.balance + '$';
    }
}