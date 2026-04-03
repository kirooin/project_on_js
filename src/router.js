import {Sidebar} from "./components/sidebar";
import { chartsManager } from './components/chart.js';
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";


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
                title: 'Главная',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load() {
                    new Login();
                }
            },
            {
                route: '#/sign-up',
                title: 'Главная',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load() {
                    new SignUp();
                }
            },
            {
                route: '#/income',
                title: 'Главная',
                filePathTemplate: '/templates/income.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '#/expenses',
                title: 'Главная',
                filePathTemplate: '/templates/expenses.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '#/create-category',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/create-category.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '#/edit-category',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/edit-category.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '#/create-income-expenses',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-income-expenses.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '#/edit-income-expenses',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/edit-income-expenses.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '#/income-expenses',
                title: 'Доходы & Расходы',
                filePathTemplate: '/templates/income-expenses.html',
                useLayout: '/templates/layout.html',
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