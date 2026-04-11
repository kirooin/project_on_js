import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";

export class SignUp {
    constructor() {

        if (AuthUtils.getAuthInfo(AuthUtils.AccessTokenKey)) {
            return location.href = '/#/'
        }
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.nameElement.value) {
            this.nameElement.classList.remove('is-invalid');
            this.nameElement.previousElementSibling.classList.remove('border-red');
        } else {
            this.nameElement.classList.add('is-invalid');
            this.nameElement.previousElementSibling.classList.add('border-red');
            isValid = false;
        }

        if (this.lastNameElement.value) {
            this.lastNameElement.classList.remove('is-invalid');
            this.lastNameElement.previousElementSibling.classList.remove('border-red');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            this.lastNameElement.previousElementSibling.classList.add('border-red');
        }

        if (this.emailElement.value && this.emailElement.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailElement.previousElementSibling.classList.remove('border-red');
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailElement.previousElementSibling.classList.add('border-red');
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordElement.previousElementSibling.classList.remove('border-red');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordElement.previousElementSibling.classList.add('border-red');
            isValid = false;
        }

        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.passwordRepeatElement.previousElementSibling.classList.remove('border-red');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            this.passwordRepeatElement.previousElementSibling.classList.add('border-red');
        }

        return isValid;
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none'
        if (this.validateForm()) {
            const result = await HttpUtils.request('/signup', 'POST', false,{
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            })
            if (result.error || !result.response || (result.response && (!result.response.user.id || !result.response.user.email || !result.response.user.name || !result.response.user.lastName))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }
            location.href = '/#/login'
       
        }
    }

}