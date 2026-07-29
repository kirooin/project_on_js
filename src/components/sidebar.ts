import {AuthUtils} from "../utils/auth-utils";
import {UserInfoType} from "../types/user-info.type";

export class Sidebar {
    readonly dropDownBtn: HTMLElement | null = null;
    readonly chevronDown: HTMLElement | null = null;
    readonly chevronRight: HTMLElement | null = null;
    readonly dropDownMenu: HTMLElement | null = null;
    readonly mainBtnLayout: HTMLElement | null = null;
    readonly incomeExpenseBtn: HTMLElement | null = null;
    readonly userName: HTMLElement | null = null;
    readonly income: HTMLElement | null = null;
    readonly expense: HTMLElement | null = null;
    readonly locationHref: string | undefined;

    constructor() {
        this.dropDownBtn = document.getElementById('dropdown-btn') as HTMLButtonElement
        this.chevronDown = document.getElementById('chevron-down') as HTMLButtonElement
        this.chevronRight = document.getElementById('chevron-right') as HTMLButtonElement
        this.dropDownMenu = document.getElementById('dropdown-menu') as HTMLButtonElement
        this.mainBtnLayout = document.getElementById('layout-btn-main') as HTMLButtonElement
        this.incomeExpenseBtn = document.getElementById('layout-btn-income-expenses')
        this.userName = document.getElementById('user-name')
        this.income = document.getElementById('income')
        this.expense = document.getElementById('expense')
        this.locationHref = (location.href.split('#')[1] || '').split('?')[0];
        this.initSidebar()
        this.testClick()

    };

    private initSidebar(): void {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) {
            return
        }

        const userInfoString = AuthUtils.getAuthInfo(AuthUtils.userInfoKey) as string | null;

        let userInfo: UserInfoType | null = null;
        if (userInfoString) {
            try {
                userInfo = JSON.parse(userInfoString) as UserInfoType;
            } catch {
                console.error('Ошибка парсинга userInfo');
            }
        }

        if (userInfo && this.userName) {
            this.userName.innerText = `${userInfo.name} ${userInfo.lastName}`;
        }

        switch (this.locationHref) {
            case '/':
                this.mainBtnLayout?.classList.add('active');
                break;

            case '/income':
            case '/income/create':
            case '/income/edit':
                if (this.dropDownBtn && this.dropDownMenu && this.income) {
                    this.dropDownBtn.classList.add('bg-primary');
                    this.dropDownBtn.classList.add('show');
                    this.dropDownMenu.classList.add('show');
                    this.chevronDown?.classList.remove('d-none')
                    this.chevronRight?.classList.add('d-none')
                    this.dropDownBtn.classList.add('text-white');
                    this.dropDownMenu.style.marginTop = '-5px';
                    this.dropDownBtn.classList.remove('text-dark-blue');
                    this.income.classList.add('active', 'text-white', 'bg-primary');
                }
                break;

            case '/expense':
            case '/expense/create':
            case '/expense/edit':
                if (this.dropDownBtn && this.dropDownMenu && this.expense) {
                    this.dropDownBtn.classList.add('bg-primary');
                    this.dropDownBtn.classList.add('show');
                    this.dropDownMenu.classList.add('show');
                    this.chevronDown?.classList.remove('d-none')
                    this.chevronRight?.classList.add('d-none')
                    this.dropDownBtn.classList.add('text-white');
                    this.dropDownMenu.style.marginTop = '-5px';
                    this.dropDownBtn.classList.remove('text-dark-blue');
                    this.expense.classList.add('active', 'text-white');
                }
                break;

            case '/income-expense':
                this.incomeExpenseBtn?.classList.add('active');
                break;
        }
    }

    private testClick(): void {
        if (this.dropDownBtn) {
            this.dropDownBtn.addEventListener('click', () => {
                if (this.dropDownBtn && this.dropDownMenu && this.chevronRight && this.chevronDown && this.dropDownBtn.getAttribute('aria-expanded') === 'true') {
                    this.dropDownBtn.classList.add('bg-primary');
                    this.dropDownBtn.classList.add('text-white');
                    this.chevronDown.classList.remove('d-none');
                    this.chevronRight.classList.add('d-none');
                    this.dropDownMenu.style.transform = 'translate(0, 40px)';
                    this.dropDownBtn.classList.remove('text-dark-blue');
                } else {
                    this.dropDownBtn!.classList.remove('bg-primary');
                    this.dropDownBtn!.classList.remove('text-white');
                    this.chevronDown!.classList.add('d-none');
                    this.chevronRight!.classList.remove('d-none');
                    this.dropDownBtn!.classList.add('text-dark-blue');
                }
            })
        }

    }


}
