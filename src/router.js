import {Sidebar} from "./components/sidebar";
import {chartsManager} from './components/chart.js';
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Balance} from "./components/balance";
import {CategoryView} from "./components/categories/category-view";
import {CategoryCreate} from "./components/categories/category-create";
import {CategoryEdit} from "./components/categories/category-edit";
import {CategoryDelete} from "./components/categories/category-delete";
import {IncomeExpense} from "./components/income-expenses";
import {OperationCreate} from "./components/operations/operaion-create";


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
                filePathTemplate: '/templates/operations/view.html',
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

                }
            },

        ]

    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.hash.split('?')[0];
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