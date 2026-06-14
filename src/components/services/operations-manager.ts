import {CommonUtils} from "../../utils/common-utils";
import {HttpUtils} from "../../utils/http-utils";

export class OperationsManager {
    readonly dateFilterFrom;
    readonly period;
    readonly startSpan: HTMLSpanElement | null;
    readonly endSpan: HTMLSpanElement | null;;

    constructor() {
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

    private initPeriodButtons(period: string): void {
        const periodButtons = document.querySelectorAll<HTMLElement>('[data-period]');
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

    async getOperations(period: string): Promise<any> {
        if (period === 'interval') {
            const input = CommonUtils.createDateInput('input-1')
            const input2 = CommonUtils.createDateInput('input-2')
            if (this.startSpan && this.endSpan) {
                // Доделать этот сервис, доделать main.ts да и просто дальше делать ёба
                this.startSpan.parentNode.replaceChild(input, this.startSpan);
                this.endSpan.parentNode.replaceChild(input2, this.endSpan);
            }


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
            return result.response;
        }


    }
}