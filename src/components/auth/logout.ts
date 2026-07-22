import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
             location.href = "/#/login";
            return
        }
        this.logout().then()
    }

  private async logout():Promise<void> {
        await HttpUtils.request('/signup', 'POST', false,{
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        })
       AuthUtils.removeAuthInfo()
       location.href = "/#/login";
    }
}