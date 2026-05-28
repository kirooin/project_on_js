import {AuthUtils} from "../utils/auth-utils";
import {chartsManager} from "./chart";
import {CommonUtils} from "../utils/common-utils";
import {HttpUtils} from "../utils/http-utils";

export class Main {
    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return location.href = "/#/login";
        }

        this.dateFilterFrom = 'today'

        this.period = location.hash.split('=')[1]

        if (this.period) {
            this.dateFilterFrom = this.period
        }
        this.startSpan = document.getElementById('startDateText')
        this.endSpan = document.getElementById('endDateText');


        this.initPeriodButtons(this.dateFilterFrom)
        this.getOperations(this.dateFilterFrom).then();
    }

    initPeriodButtons(period) {
        const periodButtons = document.querySelectorAll('[data-period]');
        periodButtons.forEach(btn => {
            if (btn.dataset.period === period) {
                btn.classList.remove('btn-outline-secondary');
                btn.classList.add('btn-secondary');
            } else {
                btn.classList.add('btn-outline-secondary');
                btn.classList.remove('btn-secondary');
            }

        })
    }

    async getOperations(period) {
        if (period === 'interval') {
            const input = CommonUtils.createDateInput('input-1')
            const input2 = CommonUtils.createDateInput('input-2')

            this.startSpan.parentNode.replaceChild(input, this.startSpan);
            this.endSpan.parentNode.replaceChild(input2, this.endSpan);

            if (input && input2) {

                await input.addEventListener('input', this.checkAndExecute.bind(this));
                await input2.addEventListener('input', this.checkAndExecute.bind(this));
            }

        } else {
            const result = await HttpUtils.request('/operations?period=' + period)

            if (result.redirect) {
                return location.href = '/#/login'
            }

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку')
            }
            this.showOperations(result.response)
        }


    }

    async checkAndExecute() {
        this.input = document.getElementById('input-1')
        this.input2 = document.getElementById('input-2')
        if (this.input.value && this.input2.value) {
            const result = await HttpUtils.request('/operations?period=interval&dateFrom=' + this.input.value + '&dateTo=' + this.input2.value)

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку')
            }

            this.showOperations(result.response)
        }
    }

    showOperations(operations) {
        const incomeArray = operations.filter(item => item.type === 'income');
        const expenseArray = operations.filter(item => item.type === 'expense');

        const chart2Data = {
            labels: expenseArray.map(item => item.category),
            values: expenseArray.map(item => item.amount)
        };
        const chartData = {
            labels: incomeArray.map(item => item.category),
            values: incomeArray.map(item => item.amount)
        };

        chartsManager.init(chartData, chart2Data)

    }
}