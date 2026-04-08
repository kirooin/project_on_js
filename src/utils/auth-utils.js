export class AuthUtils {
    static AccessTokenKey = 'accessToken';
    static RefreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static setAuthInfo(authToken, refreshToken, userInfo) {
        localStorage.setItem(this.AccessTokenKey, authToken);
        localStorage.setItem(this.RefreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    }

    static removeAuthInfo() {
        localStorage.removeItem(this.AccessTokenKey);
        localStorage.removeItem(this.RefreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    static getAuthInfo(key = null) {
        if (key && [this.AccessTokenKey, this.RefreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                [this.AccessTokenKey]: localStorage.getItem(this.AccessTokenKey),
                [this.RefreshTokenKey]: localStorage.getItem(this.RefreshTokenKey),
                [this.userInfoKey]: localStorage.getItem(this.userInfoKey),
            }
        }
    }
}