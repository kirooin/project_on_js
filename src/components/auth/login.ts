import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {RequestResultType} from "../../types/request-result.type";
import {ResponseLoginType} from "../../types/response-login.type";

export class Login {
    readonly emailElement: HTMLInputElement | null;
    readonly passwordElement: HTMLInputElement | null;
    readonly rememberElement: HTMLInputElement | null;
    readonly commonErrorElement: HTMLElement | null;

    constructor() {

        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberElement = document.getElementById('remember-me') as HTMLInputElement;


        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button')?.addEventListener('click', this.login.bind(this));
    }

    private validateForm(): boolean {
        let isValid = true;

        if (
            this.emailElement &&
            this.emailElement.value &&
            this.emailElement.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ) {
            this.emailElement.classList.remove('is-invalid');
            if (this.emailElement.previousElementSibling) {
                this.emailElement.previousElementSibling.classList.remove('border-red');
            }
        } else {
            if (this.emailElement) {
                this.emailElement.classList.add('is-invalid');
                if (this.emailElement.previousElementSibling) {
                    this.emailElement.previousElementSibling.classList.add('border-red');
                }
            }
            isValid = false;
        }

        if (this.passwordElement && this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
            if (this.passwordElement.previousElementSibling) {
                this.passwordElement.previousElementSibling.classList.remove('border-red');
            }
        } else {
            if (this.passwordElement) {
                this.passwordElement.classList.add('is-invalid');
                if (this.passwordElement.previousElementSibling) {
                    this.passwordElement.previousElementSibling.classList.add('border-red');
                }
            }
            isValid = false;
        }

        return isValid;
    }


    private async login(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if (this.validateForm() && this.emailElement && this.passwordElement && this.rememberElement) {
            const result: RequestResultType<ResponseLoginType> = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberElement.checked,
            })
            if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name))) {
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                    return;
                }
            }


            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                id: result.response.user.id,
                name: result.response.user.name,
                lastName: result.response.user.lastName
            });

            location.href = '/#/';
        }

    }
}