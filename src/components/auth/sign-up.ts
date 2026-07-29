import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";

export class SignUp {
    readonly emailElement: HTMLInputElement | undefined;
    readonly passwordElement: HTMLInputElement | undefined;
    readonly rememberElement: HTMLInputElement | undefined;
    readonly nameElement: HTMLInputElement | undefined;
    readonly lastNameElement: HTMLInputElement | undefined;
    readonly passwordRepeatElement: HTMLInputElement | undefined;
    readonly commonErrorElement: HTMLElement | undefined;
    readonly passwordErrorElement: HTMLElement | undefined;
    readonly processButton: HTMLElement | undefined;

    constructor() {

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            location.href = '/#/'
            return
        }
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.lastNameElement = document.getElementById('last-name') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById('password-repeat') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error') as HTMLElement;
        this.passwordErrorElement = document.getElementById('password-error') as HTMLElement;

        this.processButton = document.getElementById('process-button') as HTMLElement
        if (this.processButton) {
            this.processButton.addEventListener('click', this.signUp.bind(this));
        }
    }

    private validateForm(): boolean {
        let isValid = true;

        if (this.nameElement && this.nameElement.value) {
            this.nameElement.classList.remove('is-invalid');
            if (this.nameElement.previousElementSibling) {
                this.nameElement.previousElementSibling.classList.remove('border-red');
            }
        } else {
            if (this.nameElement) {
                this.nameElement.classList.add('is-invalid');
                if (this.nameElement.previousElementSibling) {
                    this.nameElement.previousElementSibling.classList.add('border-red');
                }
            }
            isValid = false;
        }

        if (this.lastNameElement && this.lastNameElement.value) {
            this.lastNameElement.classList.remove('is-invalid');
            if (this.lastNameElement.previousElementSibling) {
                this.lastNameElement.previousElementSibling.classList.remove('border-red');
            }
        } else {
            if (this.lastNameElement) {
                this.lastNameElement.classList.add('is-invalid');
                if (this.lastNameElement.previousElementSibling) {
                    this.lastNameElement.previousElementSibling.classList.add('border-red');
                }
            }
            isValid = false;
        }

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

        if (this.checkPassword()) {
            isValid = this.checkPassword();
        }

        if (
            this.passwordRepeatElement &&
            this.passwordRepeatElement.value &&
            this.passwordElement &&
            this.passwordRepeatElement.value === this.passwordElement.value
        ) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            if (this.passwordRepeatElement.previousElementSibling) {
                this.passwordRepeatElement.previousElementSibling.classList.remove('border-red');
            }
        } else {
            if (this.passwordRepeatElement) {
                this.passwordRepeatElement.classList.add('is-invalid');
                if (this.passwordRepeatElement.previousElementSibling) {
                    this.passwordRepeatElement.previousElementSibling.classList.add('border-red');
                }
            }
            isValid = false
        }

        return isValid;
    }

    private checkPassword(): boolean {
        if (!this.passwordElement || !this.passwordElement.value) {
            if (this.passwordElement) {
                this.passwordElement.classList.add('is-invalid');
                if (this.passwordElement.previousElementSibling) {
                    this.passwordElement.previousElementSibling.classList.add('border-red');
                }
            }
            if (this.passwordErrorElement) {
                this.passwordErrorElement.innerText = 'Введите пароль';
            }
            return false;
        } else {
            if (this.passwordElement) {
                this.passwordElement.classList.remove('is-invalid');
                if (this.passwordElement.previousElementSibling) {
                    this.passwordElement.previousElementSibling.classList.remove('border-red');
                }
            }
        }

        if (
            this.passwordElement &&
            this.passwordElement.value &&
            !this.passwordElement.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        ) {
            if (this.passwordElement) {
                this.passwordElement.classList.add('is-invalid');
                if (this.passwordElement.previousElementSibling) {
                    this.passwordElement.previousElementSibling.classList.add('border-red');
                }
            }
            if (this.passwordErrorElement) {
                this.passwordErrorElement.innerText = 'Пароль должен содержать минимум 8 символов, включая хотя бы одну заглавную букву, одну строчную букву и одну цифру.';
            }
            return false;
        } else {
            if (this.passwordElement) {
                this.passwordElement.classList.remove('is-invalid');
                if (this.passwordElement.previousElementSibling) {
                    this.passwordElement.previousElementSibling.classList.remove('border-red');
                }
            }
        }
        return true;
    }

    private async signUp(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none'
            if (this.validateForm() && this.nameElement && this.lastNameElement && this.emailElement && this.passwordElement && this.passwordRepeatElement) {
                const result = await HttpUtils.request('/signup', 'POST', false, {
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

}