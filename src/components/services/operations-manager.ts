import {CommonUtils} from "../../utils/common-utils";
import {HttpUtils} from "../../utils/http-utils";
import {RequestResultType} from "../../types/request-result.type";

export class OperationsManager {
    readonly dateFilterFrom;
    readonly period;
    readonly startSpan: HTMLSpanElement | null;
    readonly endSpan: HTMLSpanElement | null;
    readonly input: HTMLInputElement | null;
    readonly input2: HTMLInputElement | null;

    private onDataReceived: ((data: any) => void) | null = null;




    constructor() {
        this.dateFilterFrom = 'today'

        this.period = location.hash.split('=')[1]

        if (this.period) {
            this.dateFilterFrom = this.period
        }
        this.startSpan = document.getElementById('startDateText')
        this.endSpan = document.getElementById('endDateText');

        this.input = document.getElementById('input-1') as HTMLInputElement
        this.input2 = document.getElementById('input-2') as HTMLInputElement


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

    public async getOperations(period: string) {
        if (period === 'interval') {
            const input: HTMLElement = CommonUtils.createDateInput('input-1')
            const input2: HTMLElement = CommonUtils.createDateInput('input-2')
            if (this.startSpan && this.endSpan && this.startSpan.parentNode && this.endSpan.parentNode) {
                this.startSpan.parentNode.replaceChild(input, this.startSpan);
                this.endSpan.parentNode.replaceChild(input2, this.endSpan);
            }

            if (input && input2) {
                await input.addEventListener('input', this.checkAndExecute.bind(this));
                await input2.addEventListener('input', this.checkAndExecute.bind(this));
            }

        } else {
            const result: RequestResultType = await HttpUtils.request('/operations?period=' + period)

            if (result.redirect) {
                return location.href = '/#/login'
            }

            if (result.error || !result.response || (result.response && !result.response)) {
                return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку')
            }

            if (this.onDataReceived && result.response) {
                this.onDataReceived(result.response);
            }

            return result.response;
        }

    }


    private async checkAndExecute(): Promise<any> {
        if (this.input && this.input2 && this.input.value && this.input2.value) {
            const result: RequestResultType = await HttpUtils.request('/operations?period=interval&dateFrom=' + this.input.value + '&dateTo=' + this.input2.value)

            if (result.error || !result.response || (result.response && !result.response)) {
                alert('Возникла ошибка при запросе операций. Обратитесь в поддержку')
                return
            }

            if (this.onDataReceived && result.response) {
                this.onDataReceived(result.response);
            }

            return (result.response)
        }
    }

    public setOnDataReceived(callback: (data: any) => void): void {
        this.onDataReceived = callback;
    }
}