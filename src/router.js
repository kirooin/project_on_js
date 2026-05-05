import {Sidebar} from "./components/sidebar";
import {chartsManager} from './components/chart.js';
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {AuthUtils} from "./utils/auth-utils";
import {Balance} from "./components/balance";
import {IncomeExpenses} from "./components/income-expenses";
import {ExpensesView} from "./components/categories/expenses/expenses-view";


export class Router {
    constructor() {
        this.pageTitle = document.getElementById("page-title");
        this.pageContent = document.getElementById("page-content");
        this.initEvents();

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load() {
                    if (!AuthUtils.getAuthInfo(AuthUtils.AccessTokenKey)) {
                        return location.href = '/#/login';
                    }
                    chartsManager.init();
                }
            },
            {
                route: '#/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/auth/login.html',
                useLayout: false,
                load() {
                    new Login();
                }
            },
            {
                route: '#/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/sign-up.html',
                useLayout: false,
                load() {
                    new SignUp();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                filePathTemplate: '/templates/categories/income/view.html',
                useLayout: '/templates/layout.html',
                load() {
                }
            },
            {
                route: '#/income/edit',
                title: 'Редактировать доход',
                filePathTemplate: '/templates/categories/income/edit.html',
                useLayout: '/templates/layout.html',
                load() {
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/categories/expenses/view.html',
                useLayout: '/templates/layout.html',
                load() {
                    new ExpensesView();
                }
            },
            {
                route: '#/expenses/edit',
                title: 'Редактировать расход',
                filePathTemplate: '/templates/categories/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load() {
                    if (!AuthUtils.getAuthInfo(AuthUtils.AccessTokenKey)) {
                        return location.href = '/#/login';
                    }
                }
            },
            {
                route: '#/create-category',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/create-category.html',
                useLayout: '/templates/layout.html',
                load() {
                    if (!AuthUtils.getAuthInfo(AuthUtils.AccessTokenKey)) {
                        return location.href = '/#/login';
                    }
                }
            },
            {
                route: '#/edit-category',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/edit-category.html',
                useLayout: '/templates/layout.html',
                load() {
                    if (!AuthUtils.getAuthInfo(AuthUtils.AccessTokenKey)) {
                        return location.href = '/#/login';
                    }
                }
            },
            {
                route: '#/create-income-expenses',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-income-expenses.html',
                useLayout: '/templates/layout.html',
                load() {
                    if (!AuthUtils.getAuthInfo(AuthUtils.AccessTokenKey)) {
                        return location.href = '/#/login';
                    }
                }
            },
            {
                route: '#/edit-income-expenses',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/edit-income-expenses.html',
                useLayout: '/templates/layout.html',
                load() {
                    if (!AuthUtils.getAuthInfo(AuthUtils.AccessTokenKey)) {
                        return location.href = '/#/login';
                    }
                }
            },
            {
                route: '#/income-expenses',
                title: 'Доходы & Расходы',
                filePathTemplate: '/templates/income-expenses.html',
                useLayout: '/templates/layout.html',
                load() {
                    new IncomeExpenses()
                }
            },
        ]

    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.hash;
        const newRoute = this.routes.find(route => route.route === urlRoute);
        if (newRoute) {

            if (newRoute.title) {
                this.pageTitle.innerText = newRoute.title + ' | Lumincoin Finance';
            }
            if (newRoute.filePathTemplate) {
                let contentBlock = this.pageContent;
                if (newRoute.useLayout) {
                    contentBlock.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    new Sidebar();
                    new Balance();
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            window.location.href = '#/';
        }
    }
}