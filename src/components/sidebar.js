import {AuthUtils} from "../utils/auth-utils";

export class Sidebar {
    constructor() {
        this.dropDownBtn = document.getElementById('dropdown-btn')
        this.chevronDown = document.getElementById('chevron-down')
        this.chevronRight = document.getElementById('chevron-right')
        this.dropDownMenu = document.getElementById('dropdown-menu')
        this.mainBtnLayoit = document.getElementById('layout-btn-main')
        this.incomeExpenseBtn = document.getElementById('layout-btn-income-expenses')
        this.userName = document.getElementById('user-name')
        this.income = document.getElementById('income')
        this.expense = document.getElementById('expense')
        // this.locationHref = location.href.split('#')[1]
        this.locationHref = (location.href.split('#')[1] || '').split('?')[0];
        this.initSidebar()
        this.testClick()

    }

    initSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) {
            return
        }

        const userInfo = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey))
        if (userInfo) {
            this.userName.innerText = userInfo.name +  ' '  + userInfo.lastName
        }
        switch (this.locationHref) {
            case '/':
                this.mainBtnLayoit.classList.add('active');
                break;
            case '/income':
            case '/income/create':
            case '/income/edit':
                this.dropDownBtn.classList.add('bg-primary');
                this.dropDownBtn.classList.add('show');
                this.dropDownMenu.classList.add('show');
                this.chevronDown.classList.remove('d-none')
                this.chevronRight.classList.add('d-none')
                this.dropDownBtn.classList.add('text-white');
                this.dropDownMenu.style.marginTop = '-5px';
                this.dropDownBtn.classList.remove('text-dark-blue');
                this.income.classList.add('active', 'text-white');
                break;
            case '/expense':
            case '/expense/create':
            case '/expense/edit':
                this.dropDownBtn.classList.add('bg-primary');
                this.dropDownBtn.classList.add('show');
                this.dropDownMenu.classList.add('show');
                this.chevronDown.classList.remove('d-none')
                this.chevronRight.classList.add('d-none')
                this.dropDownBtn.classList.add('text-white');
                this.dropDownMenu.style.marginTop = '-5px';
                this.dropDownBtn.classList.remove('text-dark-blue');
                this.expense.classList.add('active', 'text-white');
                break;
            case '/income-expense':
                this.incomeExpenseBtn.classList.add('active');
                break;
        }
    }

    testClick() {
        this.dropDownBtn.addEventListener('click', () => {
            if (this.dropDownBtn.getAttribute('aria-expanded') === 'true') {
                this.dropDownBtn.classList.add('bg-primary');
                this.dropDownBtn.classList.add('text-white');
                this.chevronDown.classList.remove('d-none');
                this.chevronRight.classList.add('d-none');
                this.dropDownMenu.style.transform = 'translate(0, 40px)';
                this.dropDownBtn.classList.remove('text-dark-blue');
            } else {
                this.dropDownBtn.classList.remove('bg-primary');
                this.dropDownBtn.classList.remove('text-white');
                this.chevronDown.classList.add('d-none');
                this.chevronRight.classList.remove('d-none');
                this.dropDownBtn.classList.add('text-dark-blue');
            }
        })
    }


}
