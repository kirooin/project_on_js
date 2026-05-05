import {AuthUtils} from "../utils/auth-utils";

export class IncomeExpenses {
    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.AccessTokenKey)) {
            return location.href = '/#/login';
        }

    }
}