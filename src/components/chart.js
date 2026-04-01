import Chart from 'chart.js/auto';

class ChartsManager {
    constructor() {
        this.chart1 = null;
        this.chart2 = null;
    }

    init() {
        // Диаграмма 1
        this.chart1 = new Chart('chart1', {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    data: [35, 40, 15, 15, 10],
                    backgroundColor: ['#ff0036', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const val = ctx.raw;
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const percent = ((val / total) * 100).toFixed(1);
                                return `${ctx.label}: ${val}% (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });


        this.chart2 = new Chart('chart2', {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    data: [10, 25, 35, 30, 35],
                    backgroundColor: ['#ff0036', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
                    borderWidth: 0,
                    hoverOffset: 10,

                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const val = ctx.raw;
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const percent = ((val / total) * 100).toFixed(1);
                                return `${ctx.label}: ${val}% (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

export const chartsManager = new ChartsManager();