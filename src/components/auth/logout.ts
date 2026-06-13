import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return location.href = "/#/login";
        }
        this.logout().then()
    }

   async logout() {
        await HttpUtils.request('/signup', 'POST', false,{
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        })
       AuthUtils.removeAuthInfo()
       location.href = "/#/login";
    }
}