import {Sidebar} from "./components/sidebar";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Balance} from "./components/balance";
import {CategoryView} from "./components/categories/category-view";
import {CategoryCreate} from "./components/categories/category-create";
import {CategoryEdit} from "./components/categories/category-edit";
import {CategoryDelete} from "./components/categories/category-delete";
import {IncomeExpense} from "./components/operations/operation-view";
import {OperationCreate} from "./components/operations/operaion-create";
import {OperationEdit} from "./components/operations/operation-edit";
import {Main} from "./components/main";
import {Logout} from "./components/auth/logout";
import {OperationDelete} from "./components/operations/operation-delete";
import {RouteType} from "./types/route.type";


export class Router {
    readonly pageTitle: HTMLElement | null;
    readonly pageContent: HTMLElement | null;

    private routes: RouteType[]

    constructor() {
        this.pageTitle = document.getElementById("page-title");
        this.pageContent = document.getElementById("page-content");
        this.initEvents();

        this.routes = [
            {
                route: '#/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/auth/login.html',
                load() {
                    new Login();
                }
            },
            {
                route: '#/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/sign-up.html',
                load() {
                    new SignUp();
                }
            },
            {
                route: '#/logout',
                load() {
                    new Logout();
                }
            },
            {
                route: '#/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load() {
                    new Main()
                }
            },

            {
                route: '#/income',
                title: 'Доходы',
                filePathTemplate: '/templates/categories/view.html',
                useLayout: '/templates/layout.html',
                load() {
                    new CategoryView('income')
                }
            },
            {
                route: '#/income/create',
                title: 'Создать доход',
                filePathTemplate: '/templates/categories/create.html',
                useLayout: '/templates/layout.html',
                load() {
                    new CategoryCreate('income')
                }
            },
            {
                route: '#/income/edit',
                title: 'Редактировать доход',
                filePathTemplate: '/templates/categories/edit.html',
                useLayout: '/templates/layout.html',
                load() {
                    new CategoryEdit('income')
                }
            },
            {
                route: '#/income/delete',
                load() {
                    new CategoryDelete('income')
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/categories/view.html',
                useLayout: '/templates/layout.html',
                load() {
                    new CategoryView('expense')
                }
            },
            {
                route: '#/expense/edit',
                title: 'Редактировать расход',
                filePathTemplate: '/templates/categories/edit.html',
                useLayout: '/templates/layout.html',
                load() {
                    new CategoryEdit('expense')
                }
            },
            {
                route: '#/expense/create',
                title: 'Создать расход',
                filePathTemplate: '/templates/categories/create.html',
                useLayout: '/templates/layout.html',
                load() {
                    new CategoryCreate('expense')

                }
            },
            {
                route: '#/expense/delete',
                load() {
                    new CategoryDelete('expense')
                }
            },
            {
                route: '#/income-expense',
                title: 'Доходы & Расходы',
                filePathTemplate: '/templates/operations/list.html',
                useLayout: '/templates/layout.html',
                load() {
                    new IncomeExpense()
                }
            },
            {
                route: '#/income-expense/create/income',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/operations/create.html',
                useLayout: '/templates/layout.html',
                load() {
                    new OperationCreate()
                }
            },
            {
                route: '#/income-expense/create/expense',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/operations/create.html',
                useLayout: '/templates/layout.html',
                load() {
                    new OperationCreate()
                }
            },
            {
                route: '#/income-expense/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/operations/edit.html',
                useLayout: '/templates/layout.html',
                load() {
                    new OperationEdit()
                }
            },
            {
                route: '#/income-expense/delete',
                load() {
                    new OperationDelete()
                }
            },

        ]

    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    private async activateRoute(): Promise<void> {
        const urlRoute: string | undefined = window.location.hash.split('?')[0];
        const newRoute: RouteType | undefined = this.routes.find(route => route.route === urlRoute);
        if (newRoute) {

            if (newRoute.title && this.pageTitle) {
                this.pageTitle.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.pageContent;
                if (newRoute.useLayout && contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    new Sidebar();
                    new Balance();
                }
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                }
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            window.location.href = '#/';
        }
    }
}