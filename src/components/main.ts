import {AuthUtils} from "../utils/auth-utils";
import {chartsManager} from "./chart";
import {OperationsManager} from "./services/operations-manager";
import {OperationIntervalType} from "../types/operation-interval.type";
import {ChartDataArrayType} from "../types/chart-data-array.type";


export class Main {

    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            location.href = "/#/login";
            return
        }

        const operationsManager = new OperationsManager()
        operationsManager.setOnDataReceived(data => {
            this.showOperations(data)
        })
    }



    showOperations(operations: OperationIntervalType[]) {
        const incomeArray: OperationIntervalType[] = operations.filter(item => item.type === 'income');
        const expenseArray: OperationIntervalType[] = operations.filter(item => item.type === 'expense');

        const chart2Data: ChartDataArrayType = {
            labels: expenseArray.map(item => item.category),
            values: expenseArray.map(item => item.amount)
        };
        const chartData: ChartDataArrayType = {
            labels: incomeArray.map(item => item.category),
            values: incomeArray.map(item => item.amount)
        };
        chartsManager.init(chartData, chart2Data)
    }
}