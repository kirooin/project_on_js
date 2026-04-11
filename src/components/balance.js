import {HttpUtils} from "../utils/http-utils";

export class Balance {
    constructor() {
        this.getBalance().then();
        console.log('Баланс!')
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance')
        console.log(result.response)
    }
}