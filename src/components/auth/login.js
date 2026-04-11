import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Login {
    constructor() {

        if (AuthUtils.getAuthInfo(AuthUtils.AccessTokenKey)) {
            return location.href = '/#/'
        }

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberElement = document.getElementById('remember-me');


        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.emailElement.value && this.emailElement.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailElement.previousElementSibling.classList.remove('border-red');
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailElement.previousElementSibling.classList.add('border-red');
            isValid = false;
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordElement.previousElementSibling.classList.remove('border-red');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordElement.previousElementSibling.classList.add('border-red');
            isValid = false;
        }
        return isValid;
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
         const result = await HttpUtils.request('/login', 'POST', false,{
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberElement.checked,
            })
            console.log(result.response)

            if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {id: result.response.user.id, name: result.response.user.name, lastName: result.response.user.lastName});

            location.href = '/#/';
        }
    }
}