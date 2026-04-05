export class AuthUtils {
    static AccessTokenKey = 'accessToken';
    static RefreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static setAuthInfo (authToken, refreshToken, userInfo) {
        localStorage.setItem(this.AccessTokenKey, authToken);
        localStorage.setItem(this.RefreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    }

    static removeAuthInfo () {
        localStorage.removeItem(this.AccessTokenKey);
        localStorage.removeItem(this.RefreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }
}