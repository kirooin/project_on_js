import config from "../config/config";
import {AuthUtils} from "../utils/auth-utils";

export class Login {
    constructor() {


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
            const result = await fetch(config.api + '/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberElement.checked,
                })
            })
            if (result.status === 401) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            const data = await result.json();
           
        }
    }
}