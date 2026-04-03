export class SignUp {
 constructor() {

     this.nameElement = document.getElementById('name');
     this.lastNameElement = document.getElementById('last-name');
     this.emailElement = document.getElementById('email');
     this.passwordElement = document.getElementById('password');
     this.passwordRepeatElement = document.getElementById('password-repeat');

     document.getElementById('process-button').addEventListener('click', this.validateForm.bind(this));
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

        if (this.passwordElement.value) {
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

}