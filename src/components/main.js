import {AuthUtils} from "../utils/auth-utils";
import {chartsManager} from "./chart";

export class Main {
    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return location.href = "/#/login";
        }
        chartsManager.init();

    }
}